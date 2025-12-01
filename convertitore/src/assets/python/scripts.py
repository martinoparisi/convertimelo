import pint
import json
ureg = pint.UnitRegistry()

def convert_unit(value, from_unit, to_unit):
    try:
        quantity = float(value) * ureg(from_unit)
        converted = quantity.to(to_unit)
        return json.dumps({"result": converted.magnitude, "unit": str(converted.units)})
    except Exception as e:
        return json.dumps({"error": str(e)})

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
