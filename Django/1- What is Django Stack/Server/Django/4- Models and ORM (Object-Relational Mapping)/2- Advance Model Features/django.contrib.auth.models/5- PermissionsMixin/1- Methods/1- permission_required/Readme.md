## permission_required

### Type:
- List of strings (`List[str]`)

### Purpose:
This is a list of permissions that the user must have to access the view.

### Usage:
You specify a list of permission strings in the form `app_label.permission_codename`.

---

### Example:

```python
permission_required = ['auth.add_user', 'auth.change_user']
