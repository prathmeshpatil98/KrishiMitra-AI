import inspect
import pkgutil
import langgraph
from app.graph import graph

print('graph type:', type(graph))
print('graph methods:', [m for m in dir(graph) if not m.startswith('_')][:60])
print('ainvoke signature:', inspect.signature(graph.ainvoke))
print('ainvoke doc:', graph.ainvoke.__doc__)
print('\nlanggraph modules:')
print([m.name for m in pkgutil.iter_modules(langgraph.__path__)])
try:
    import langgraph.graph
    print('langgraph.graph module:', langgraph.graph)
    print('langgraph.graph attrs:', [a for a in dir(langgraph.graph) if not a.startswith('_')][:100])
except Exception as exc:
    print('failed import langgraph.graph:', exc)
try:
    from langgraph.graph import runnable
    print('runnable module attrs:', [a for a in dir(runnable) if not a.startswith('_')][:100])
except Exception as exc:
    print('failed import langgraph.graph.runnable:', exc)
