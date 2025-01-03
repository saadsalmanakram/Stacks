# 🧪 Adding String Representation (`__str__`)

The `__str__` method defines the human-readable string representation of the model.

### Example:

```python
class Employee(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
