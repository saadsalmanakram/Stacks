### filter_permissions_for_model:

- **Arguments**: model_class
- **Purpose**: Returns all permissions related to a specific model class.
- **Usage**: Used to filter permissions for a given model.

#### Example:

```python
def filter_permissions_for_model(self, model_class):
    content_type = ContentType.objects.get_for_model(model_class)
    return self.filter(content_type=content_type)
