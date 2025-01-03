## create_superuser Method

### Arguments:
- **email**: The email address of the superuser.
- **password**: The password for the superuser (optional).
- **extra_fields**: Additional fields that can be passed for superuser creation.

### Purpose:
This method creates a superuser (an admin user with all permissions) by setting the `is_staff` and `is_superuser` flags to `True`.

---

### Example:

```python
def create_superuser(self, email, password=None, **extra_fields):
    extra_fields.setdefault("is_staff", True)
    extra_fields.setdefault("is_superuser", True)

    return self.create_user(email, password, **extra_fields)
