# 📅 Automatically Adding Timestamps

Django provides options to automatically track creation and modification times.

### Example:

```python
class Post(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)  # Set when created
    updated_at = models.DateTimeField(auto_now=True)     # Set when updated
