from firebase_functions import https_fn
from firebase_admin import initialize_app
import pint
import json
import google.generativeai as genai
import os
from PIL import Image
import io
import base64

initialize_app()
ureg = pint.UnitRegistry()

def cors_enabled(func):
    def wrapper(req: https_fn.Request) -> https_fn.Response:
        if req.method == 'OPTIONS':
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600'
            }
            return https_fn.Response('', status=204, headers=headers)

        headers = {'Access-Control-Allow-Origin': '*'}
        try:
            response = func(req)
            # If response is already a Response object, add headers
            if isinstance(response, https_fn.Response):
                response.headers.update(headers)
                return response
            # Otherwise assume it's data and wrap it
            return https_fn.Response(json.dumps(response), headers=headers, content_type='application/json')
        except Exception as e:
            return https_fn.Response(json.dumps({'error': str(e)}), status=500, headers=headers, content_type='application/json')
    return wrapper

@https_fn.on_request()
@cors_enabled
def unit_converter(req: https_fn.Request) -> https_fn.Response:
    try:
        data = req.get_json()
        value = float(data.get('value'))
        from_unit = data.get('from_unit')
        to_unit = data.get('to_unit')

        quantity = value * ureg(from_unit)
        converted = quantity.to(to_unit)
        
        return {'result': converted.magnitude, 'unit': str(converted.units)}
    except Exception as e:
        raise e

@https_fn.on_request()
@cors_enabled
def text_manipulator(req: https_fn.Request) -> https_fn.Response:
    try:
        data = req.get_json()
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
            return https_fn.Response(json.dumps({'error': 'Invalid operation'}), status=400)
            
        return {'result': result}
    except Exception as e:
        raise e

@https_fn.on_request()
@cors_enabled
def genkit_generate(req: https_fn.Request) -> https_fn.Response:
    try:
        data = req.get_json()
        prompt = data.get('prompt')
        
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
             return https_fn.Response(json.dumps({'error': 'API Key not configured'}), status=500)

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        return {'text': response.text}
    except Exception as e:
        raise e

@https_fn.on_request()
@cors_enabled
def file_converter(req: https_fn.Request) -> https_fn.Response:
    try:
        data = req.get_json()
        file_data = data.get('file') # Base64 encoded string
        target_format = data.get('format') # e.g., 'JPEG', 'PNG', 'WEBP'
        quality = data.get('quality', 80) # 0-100

        if not file_data or not target_format:
             return https_fn.Response(json.dumps({'error': 'Missing file or format'}), status=400)

        # Decode base64
        # Remove header if present (e.g., "data:image/png;base64,")
        if ',' in file_data:
            file_data = file_data.split(',')[1]
        
        image_bytes = base64.b64decode(file_data)
        image = Image.open(io.BytesIO(image_bytes))

        # Convert
        output = io.BytesIO()
        
        # Handle transparency for JPEG
        if target_format.upper() == 'JPEG' and image.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1])
            image = background
        elif image.mode == 'P':
             image = image.convert('RGB')

        save_kwargs = {}
        if target_format.upper() in ('JPEG', 'WEBP'):
             save_kwargs['quality'] = int(quality)

        image.save(output, format=target_format.upper(), **save_kwargs)
        output.seek(0)
        
        converted_base64 = base64.b64encode(output.getvalue()).decode('utf-8')
        mime_type = f"image/{target_format.lower()}"
        
        return {'file': f"data:{mime_type};base64,{converted_base64}"}

    except Exception as e:
        return https_fn.Response(json.dumps({'error': str(e)}), status=500)