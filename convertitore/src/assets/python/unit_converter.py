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
