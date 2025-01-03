# 🔄 Adding Default Values

You can add default values to your model fields using the `default` parameter.

### Example:

```python
class Task(models.Model):
    title = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='Pending')
