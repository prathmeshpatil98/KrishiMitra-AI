import inspect
from app.graph import graph

print('checkpointer type:', type(graph.checkpointer))
print('checkpointer repr:', repr(graph.checkpointer))
print('checkpointer dir:')
for name in dir(graph.checkpointer):
    if not name.startswith('_'):
        print(name)

try:
    print('checkpointer configurable_attrs:', graph.checkpointer.__dict__)
except Exception as exc:
    print('checkpointer __dict__ failed:', exc)

if hasattr(graph.checkpointer, 'get_configurable_keys'):
    print('get_configurable_keys:', graph.checkpointer.get_configurable_keys())

if hasattr(graph.checkpointer, 'configurable'):
    print('configurable attr:', graph.checkpointer.configurable)

print('graph has method invoke?', callable(getattr(graph, 'invoke', None)))
print('graph invoke signature:', inspect.signature(graph.invoke))
print('graph ainvoke signature:', inspect.signature(graph.ainvoke))
