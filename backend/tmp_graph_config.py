import json
from app.graph import graph
print('config_schema type:', type(graph.config_schema))
print('config_schema:', graph.config_schema)
try:
    print('config_schema schema:', json.dumps(graph.config_schema.schema(), indent=2))
except Exception as exc:
    print('config_schema dump failed:', exc)
print('config_specs:', graph.config_specs)
print('get_config_jsonschema:', graph.get_config_jsonschema())
print('graph.get_input_schema:', graph.get_input_schema())
print('graph.context_schema:', graph.context_schema)
print('graph.get_state:', type(graph.get_state()))
