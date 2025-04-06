# GraphPrompt: Unifying Pre-Training and Downstream Tasks for Graph Neural Networks

GraphPrompt is a novel framework that unifies pre-training and downstream tasks for Graph Neural Networks (GNNs). It introduces a prompting mechanism inspired by natural language processing (NLP) models to improve knowledge transfer between pre-training and downstream tasks. This repository provides an implementation of GraphPrompt, including pre-training, few-shot node classification, and few-shot graph classification.

## Features
- **Unified Pre-Training Framework**: Uses subgraph similarity learning for knowledge transfer.
- **Learnable Prompting**: Enhances task-specific adaptations without fine-tuning.
- **Efficient Few-Shot Learning**: Works well with limited supervision.
- **Supports Node and Graph Classification**: Handles multiple downstream tasks.

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/GraphPrompt.git
cd GraphPrompt

# Create a virtual environment
python -m venv env
source env/bin/activate  # On Windows use: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Usage
### 1. Pre-Training the Model
The pre-training phase uses link prediction on unlabeled graphs.

```python
from graphprompt import GraphPrompt

graphprompt = GraphPrompt(dataset='PROTEINS', pretrain=True)
graphprompt.train()
```

### 2. Node Classification (Few-Shot)
After pre-training, we use the learned embeddings for node classification.

```python
from graphprompt import GraphPrompt

graphprompt = GraphPrompt(dataset='PROTEINS', pretrain=False)
accuracy = graphprompt.node_classification(k_shot=5)
print(f"Node Classification Accuracy: {accuracy:.2f}%")
```

### 3. Graph Classification (Few-Shot)
Similarly, we can apply the framework to graph-level classification.

```python
accuracy = graphprompt.graph_classification(k_shot=5)
print(f"Graph Classification Accuracy: {accuracy:.2f}%")
```

## Dataset
GraphPrompt supports multiple datasets, including:
- **Flickr**: Social network graph with image metadata.
- **PROTEINS**: Protein interaction graphs.
- **COX2**: Molecular structure graphs.
- **ENZYMES**: Graphs of enzyme interactions.
- **BZR**: Ligand-receptor binding graphs.

## Example Code Snippets
### 1. Defining the Graph Neural Network (GNN) Backbone
```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv

class GNN(torch.nn.Module):
    def __init__(self, in_channels, hidden_channels, out_channels):
        super().__init__()
        self.conv1 = GCNConv(in_channels, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, out_channels)
    
    def forward(self, x, edge_index):
        x = F.relu(self.conv1(x, edge_index))
        x = self.conv2(x, edge_index)
        return x
```

### 2. Prompt-based ReadOut Mechanism
```python
def readout(subgraph, prompt):
    node_embeddings = subgraph.x
    aggregated = torch.sum(node_embeddings * prompt, dim=0)
    return aggregated
```

### 3. Training Loop for GraphPrompt
```python
model = GNN(in_channels=128, hidden_channels=256, out_channels=64)
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

def train(model, data, epochs=100):
    model.train()
    for epoch in range(epochs):
        optimizer.zero_grad()
        out = model(data.x, data.edge_index)
        loss = F.cross_entropy(out[data.train_mask], data.y[data.train_mask])
        loss.backward()
        optimizer.step()
        print(f"Epoch {epoch+1}/{epochs}, Loss: {loss.item():.4f}")

train(model, dataset)
```

## Performance Benchmarks
GraphPrompt achieves state-of-the-art results on various datasets:
| Dataset  | Node Classification (%) | Graph Classification (%) |
|----------|------------------------|------------------------|
| PROTEINS | 63.03                   | 64.42                   |
| COX2     | -                        | 59.21                   |
| ENZYMES  | 67.04                   | 31.45                   |


