## Custom User Model with AbstractBaseUser

### Custom Fields
When you use `AbstractBaseUser`, you are expected to define custom fields for your user model, such as `username`, `email`, `first_name`, etc. It gives you full control over how you store and identify users.

---

### Required Methods
When you subclass `AbstractBaseUser`, you also need to implement the `USERNAME_FIELD` and `REQUIRED_FIELDS` attributes in your custom user model.

- **USERNAME_FIELD**: The field that will be used for authentication (usually `email` or `username`).
- **REQUIRED_FIELDS**: A list of fields that are required when creating a user via `createsuperuser` or other methods.

---

### Example of a Custom User Model with AbstractBaseUser

```python
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# Custom User Model
class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    # Required Methods
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
