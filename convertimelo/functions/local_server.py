from flask import Flask, request, jsonify
from flask_cors import CORS
import pint
import google.generativeai as genai
import os

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
    # Implementazione placeholder per file converter se necessario
    return jsonify({'error': 'File converter not implemented locally yet'}), 501

if __name__ == '__main__':
    # Esegue il server su tutti gli indirizzi IP (0.0.0.0) porta 5000
    print("Server Python avviato su http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
