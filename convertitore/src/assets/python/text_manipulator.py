import json

def manipulate_text(text, operation):
    try:
        if operation == 'uppercase':
            res = text.upper()
        elif operation == 'lowercase':
            res = text.lower()
        elif operation == 'reverse':
            res = text[::-1]
        elif operation == 'word_count':
            res = len(text.split())
        elif operation == 'char_count':
            res = len(text)
        else:
            res = text
        return json.dumps({"result": res})
    except Exception as e:
        return json.dumps({"error": str(e)})
