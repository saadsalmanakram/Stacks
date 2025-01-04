## create_user Method

### Arguments:
- **email**: The email address of the user.
- **password**: The password for the user (optional).
- **extra_fields**: Additional fields that can be passed for user creation.

### Purpose:
This method creates a regular user. It ensures that the email is valid, normalizes it, and sets the password before saving the user to the database.

---

### Example:

```python
def create_user(self, email, password=None, **extra_fields):
    if not email:
        raise ValueError("The Email field must be set")
    email = self.normalize_email(email)
    user = self.model(email=email, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user
