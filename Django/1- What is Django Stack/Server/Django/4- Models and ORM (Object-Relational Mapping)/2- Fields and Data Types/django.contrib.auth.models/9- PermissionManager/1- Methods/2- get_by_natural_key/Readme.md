### get_by_natural_key:

- **Arguments**: codename, content_type
- **Purpose**: This method retrieves a permission by its codename and associated content_type.
- **Usage**: Often used when looking up permissions by a unique combination of codename and content_type.

#### Example:

```python
def get_by_natural_key(self, codename, content_type):
    return self.get(codename=codename, content_type=content_type)
