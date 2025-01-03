## get_permission_required

### Purpose:
This method returns the list of permissions required for the view. It is used internally by Django to check permissions for a view.

---

### Example:

```python
def get_permission_required(self):
    return self.permission_required
