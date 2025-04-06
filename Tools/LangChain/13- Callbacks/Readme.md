# Callbacks in LangChain

Callbacks in LangChain provide a mechanism to monitor, log, and interact with various stages of your workflow. They are especially useful for debugging, logging metrics, or triggering custom logic when specific events occur during a chain or agent execution.

---

## Why Use Callbacks?

1. **Debugging:** Trace the step-by-step flow of execution in your chains and agents.
2. **Monitoring:** Log metrics and outputs for performance analysis.
3. **Custom Logic:** Trigger specific actions based on events.
4. **Transparency:** Understand what happens at each step of the execution process.

---

## Key Features

- Track execution at multiple levels: chains, tools, LLMs, and more.
- Log intermediate outputs and metadata.
- Customize behavior with your own callback implementations.
- Built-in support for popular logging tools.

---

## Built-in Callbacks

LangChain provides several built-in callbacks that cater to common use cases:

### 1. **`StdOutCallbackHandler`**
Logs all events and outputs to the console.

#### Example:
```python
from langchain.callbacks import StdOutCallbackHandler

callback = StdOutCallbackHandler()
callbacks = [callback]

# Pass callbacks to a chain or agent
result = chain.run(input_data, callbacks=callbacks)
```

---

### 2. **`WandbCallbackHandler`**
Integrates with Weights and Biases for tracking metrics.

#### Example:
```python
from langchain.callbacks import WandbCallbackHandler

callback = WandbCallbackHandler(project="langchain-experiments")
callbacks = [callback]

# Pass callbacks to a chain or agent
result = chain.run(input_data, callbacks=callbacks)
```

---

### 3. **`TracerCallbackHandler`**
Tracks and visualizes execution using LangChain's built-in tracer.

#### Example:
```python
from langchain.callbacks import TracerCallbackHandler

callback = TracerCallbackHandler()
callbacks = [callback]

# Pass callbacks to a chain or agent
result = chain.run(input_data, callbacks=callbacks)
```

---

## Custom Callbacks

You can define your own callbacks by subclassing `BaseCallbackHandler` and overriding the appropriate methods. These methods correspond to specific events like starting or ending a chain, tool, or LLM execution.

### Example: Custom Logger Callback
```python
from langchain.callbacks import BaseCallbackHandler

class CustomLogger(BaseCallbackHandler):
    def on_chain_start(self, chain, inputs, **kwargs):
        print(f"Starting chain: {chain} with inputs: {inputs}")

    def on_chain_end(self, chain, outputs, **kwargs):
        print(f"Chain completed with outputs: {outputs}")

callback = CustomLogger()
callbacks = [callback]

# Pass the custom callback to a chain or agent
result = chain.run(input_data, callbacks=callbacks)
```

---

## Common Methods in Callbacks

Here are some key methods you can override in custom callbacks:

- `on_chain_start`: Triggered when a chain starts.
- `on_chain_end`: Triggered when a chain ends.
- `on_tool_start`: Triggered when a tool is invoked.
- `on_tool_end`: Triggered when a tool finishes execution.
- `on_llm_start`: Triggered when an LLM request starts.
- `on_llm_end`: Triggered when an LLM request completes.
- `on_error`: Triggered when an error occurs.

---

## Attaching Callbacks to Chains and Agents

You can attach callbacks directly when running chains or agents by passing them as the `callbacks` parameter:

```python
callbacks = [StdOutCallbackHandler(), CustomLogger()]
result = chain.run(input_data, callbacks=callbacks)
```

---

## Best Practices

1. **Use Multiple Callbacks:** Combine built-in and custom callbacks for comprehensive monitoring.
2. **Handle Errors Gracefully:** Implement `on_error` to manage exceptions effectively.
3. **Minimize Overhead:** Avoid excessive logging in production to reduce performance impact.
4. **Test Custom Callbacks:** Ensure your custom callbacks work as intended across various scenarios.

---

## Resources

- [LangChain Documentation](https://www.langchain.com/docs)
- [Weights and Biases](https://wandb.ai/)
- [LangChain Tracer](https://www.langchain.com/tracer)

---

