from flask import Flask, request, jsonify
from flask_cors import CORS
import pint
import google.generativeai as genai
import os
import base64
import io
import tempfile
import subprocess
import json
from PIL import Image
import imageio_ffmpeg
from fpdf import FPDF

app = Flask(__name__)
# Abilita CORS per permettere chiamate da qualsiasi IP (necessario per l'accesso da mobile)
CORS(app, resources={r"/*": {"origins": "*"}})

ureg = pint.UnitRegistry()

@app.route('/unit_converter', methods=['POST'])
def unit_converter():
    try:
        data = request.get_json()
        value = float(data.get('value'))
        from_unit = data.get('from_unit')
        to_unit = data.get('to_unit')

        quantity = value * ureg(from_unit)
        converted = quantity.to(to_unit)
        
        return jsonify({'result': converted.magnitude, 'unit': str(converted.units)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/text_manipulator', methods=['POST'])
def text_manipulator():
    try:
        data = request.get_json()
        text = data.get('text', '')
        operation = data.get('operation')

        if operation == 'uppercase':
            result = text.upper()
        elif operation == 'lowercase':
            result = text.lower()
        elif operation == 'reverse':
            result = text[::-1]
        elif operation == 'word_count':
            result = len(text.split())
        elif operation == 'char_count':
            result = len(text)
        else:
            return jsonify({'error': 'Invalid operation'}), 400
            
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/genkit_generate', methods=['POST'])
def genkit_generate():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        
        # Assicurati di impostare la variabile d'ambiente GOOGLE_API_KEY o inseriscila qui
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
             return jsonify({'error': 'API Key not configured'}), 500

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        return jsonify({'text': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/file_converter', methods=['POST'])
def file_converter():
    try:
        data = request.get_json()
        file_data = data.get('file') # Base64 encoded string
        target_format = data.get('format') # e.g., 'JPEG', 'PNG', 'WEBP', 'MP3', 'WAV'
        quality = data.get('quality', 80) # 0-100

        if not file_data or not target_format:
             return jsonify({'error': 'Missing file or format'}), 400

        # Decode base64
        if ',' in file_data:
            file_data = file_data.split(',')[1]
        
        file_bytes = base64.b64decode(file_data)
        
        target_format_upper = target_format.upper()
        
        # Image formats
        if target_format_upper in ['JPEG', 'JPG', 'PNG', 'WEBP', 'GIF', 'BMP', 'TIFF']:
            image = Image.open(io.BytesIO(file_bytes))
            output = io.BytesIO()
            
            # Handle transparency for JPEG
            if target_format_upper in ['JPEG', 'JPG'] and image.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[-1])
                image = background
            elif image.mode == 'P':
                 image = image.convert('RGB')

            save_kwargs = {}
            if target_format_upper in ('JPEG', 'JPG', 'WEBP'):
                 save_kwargs['quality'] = int(quality)

            image.save(output, format=target_format_upper, **save_kwargs)
            output.seek(0)
            
            converted_base64 = base64.b64encode(output.getvalue()).decode('utf-8')
            mime_type = f"image/{target_format.lower()}"
            return jsonify({'file': f"data:{mime_type};base64,{converted_base64}"})

        # Audio/Video formats
        elif target_format_upper in ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'MP4']:
            # Use ffmpeg directly via subprocess
            with tempfile.NamedTemporaryFile(delete=False) as temp_in:
                temp_in.write(file_bytes)
                temp_in_path = temp_in.name
            
            temp_out_path = None
            try:
                # Create output temp file path
                with tempfile.NamedTemporaryFile(delete=False, suffix=f".{target_format.lower()}") as temp_out:
                    temp_out_path = temp_out.name
                
                # Close and remove so ffmpeg can write to it
                try:
                    os.remove(temp_out_path)
                except OSError:
                    pass

                # Construct ffmpeg command
                ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
                cmd = [ffmpeg_exe, '-y', '-i', temp_in_path]
                
                # Quality/Bitrate settings
                if target_format_upper == 'MP3':
                    bitrate = f"{quality}k" if quality > 100 else "192k"
                    cmd.extend(['-b:a', bitrate])
                elif target_format_upper == 'MP4':
                    cmd.extend(['-preset', 'fast'])
                
                cmd.append(temp_out_path)
                
                # Run ffmpeg
                # Use creationflags to hide console window on Windows
                startupinfo = None
                if os.name == 'nt':
                    startupinfo = subprocess.STARTUPINFO()
                    startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
                
                result = subprocess.run(cmd, capture_output=True, text=True, startupinfo=startupinfo)
                
                if result.returncode != 0:
                    raise Exception(f"FFmpeg conversion failed: {result.stderr}")
                
                if not os.path.exists(temp_out_path):
                     raise Exception("FFmpeg did not create output file")

                with open(temp_out_path, "rb") as f:
                    converted_bytes = f.read()
                    
                converted_base64 = base64.b64encode(converted_bytes).decode('utf-8')
                
                mime_type = f"audio/{target_format.lower()}"
                if target_format_upper == 'MP4':
                    mime_type = "video/mp4"
                
                return jsonify({'file': f"data:{mime_type};base64,{converted_base64}"})
            except FileNotFoundError:
                 return jsonify({'error': 'FFmpeg not found. Please install FFmpeg and add it to your PATH.'}), 500
            except Exception as e:
                 return jsonify({'error': str(e)}), 500
            finally:
                if os.path.exists(temp_in_path):
                    try:
                        os.remove(temp_in_path)
                    except:
                        pass
                if temp_out_path and os.path.exists(temp_out_path):
                    try:
                        os.remove(temp_out_path)
                    except:
                        pass

        # PDF format
        elif target_format_upper == 'PDF':
            # Try to detect if it's an image
            try:
                image = Image.open(io.BytesIO(file_bytes))
                output = io.BytesIO()
                if image.mode != 'RGB':
                    image = image.convert('RGB')
                image.save(output, format='PDF')
                output.seek(0)
                converted_base64 = base64.b64encode(output.getvalue()).decode('utf-8')
                return jsonify({'file': f"data:application/pdf;base64,{converted_base64}"})
            except Exception:
                # Not an image, try text
                try:
                    text_content = file_bytes.decode('utf-8')
                    pdf = FPDF()
                    pdf.add_page()
                    pdf.set_font("Arial", size=12)
                    # FPDF doesn't handle utf-8 well by default in standard fonts, but let's try basic
                    # For better utf-8 support we need a unicode font, but let's stick to basic for now
                    # Replace unsupported characters or handle encoding
                    pdf.multi_cell(0, 10, text_content.encode('latin-1', 'replace').decode('latin-1'))
                    
                    output_string = pdf.output(dest='S')
                    # FPDF output(dest='S') returns a string (latin-1 encoded bytes actually in py3)
                    # We need bytes
                    if isinstance(output_string, str):
                        pdf_bytes = output_string.encode('latin-1')
                    else:
                        pdf_bytes = output_string # bytearray
                        
                    converted_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
                    return jsonify({'file': f"data:application/pdf;base64,{converted_base64}"})
                except Exception:
                    # If both fail, it's likely a complex doc like PPTX/DOCX which we don't support yet
                    return jsonify({'error': 'PDF conversion is currently only supported for Images and Text files. PPTX/DOCX conversion requires a dedicated backend.'}), 400

        else:
            return jsonify({'error': f'Unsupported format: {target_format}'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Esegue il server su tutti gli indirizzi IP (0.0.0.0) porta 5000
    print("Server Python avviato su http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
