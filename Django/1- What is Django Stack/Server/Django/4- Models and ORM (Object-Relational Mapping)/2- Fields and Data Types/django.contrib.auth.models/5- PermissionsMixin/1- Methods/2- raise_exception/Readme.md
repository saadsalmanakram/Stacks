## raise_exception

### Type:
- Boolean (default: `False`)

### Purpose:
When set to `True`, it will raise a `PermissionDenied` exception if the user does not have the required permissions. If set to `False`, it will redirect the user to the login page (or another specified URL) if permission is denied.

### Usage:
Typically used in views where you want to immediately raise an error when permissions are not met.

---

### Example:

```python
raise_exception = True
