
---

# Django `AbstractBaseUser` Model Documentation

## Overview
The `AbstractBaseUser` model is a low-level base class for creating custom user models in Django. Unlike `AbstractUser`, which includes several built-in fields like `username`, `email`, and `password`, `AbstractBaseUser` provides only the essential fields and methods necessary for user authentication and management. It is a more flexible, minimalistic option for creating highly customized user models from scratch.

`AbstractBaseUser` does not include any fields for storing user-related information such as `username`, `email`, or `first_name`. Instead, you define the fields you need in your custom model. This model is ideal if you want complete control over the structure of your user model.

---

## Key Fields in the `AbstractBaseUser` Model

The `AbstractBaseUser` model includes the following essential fields:

### 1. `password`
- **Type**: `CharField`
- **Max Length**: `128`
- **Description**: This field stores the hashed password for the user.
- **Usage**: The `password` field is required to store the user's authentication credentials. The password is stored in a hashed format for security purposes.
  
### 2. `last_login`
- **Type**: `DateTimeField`
- **Description**: This field stores the date and time of the last login for the user.
- **Usage**: The `last_login` field is automatically updated when the user logs in and can be used for tracking user activity or last login times.
- **Attributes**:
  - Can be `null`: `True`
  - Automatically updated on login

### 3. `is_active`
- **Type**: `BooleanField`
- **Description**: A flag indicating whether the user account is active.
- **Usage**: This field is used to deactivate a user without deleting their account. When set to `False`, the user is effectively deactivated and cannot log in.
- **Attributes**:
  - Default: `True`
  
---

## Key Methods of the `AbstractBaseUser` Model

Since `AbstractBaseUser` provides a very basic structure for user management, it includes only essential authentication methods. You can define additional methods or override existing ones to tailor the behavior of your custom user model.

### 1. `set_password(raw_password)`
- **Description**: This method takes a plain text password and sets it for the user after hashing it.
- **Usage**: It is used to securely hash and set the user's password.
- **Example**:
  ```python
  user.set_password('my_secure_password')
  ```

### 2. `check_password(raw_password)`
- **Description**: Verifies whether the provided plain text password matches the stored hashed password.
- **Usage**: This method is used to authenticate the user, typically when a user logs in.
- **Example**:
  ```python
  if user.check_password('my_secure_password'):
      # Authentication successful
  else:
      # Authentication failed
  ```

### 3. `get_session_auth_hash()`
- **Description**: Returns the hash of the user's password that can be used for session management.
- **Usage**: This method is useful for checking if a user’s password has changed during an active session.
- **Example**:
  ```python
  session_hash = user.get_session_auth_hash()
  ```

---

## Creating a Custom User Model with `AbstractBaseUser`

`AbstractBaseUser` is the starting point for building a completely custom user model. You can define custom fields and methods for your user model while still using Django’s authentication system. Here's an example of how to create a custom user model by subclassing `AbstractBaseUser`:

### Example of a Custom User Model Using `AbstractBaseUser`

```python
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
```

In this example:
- **`CustomUser`** is the custom user model that subclasses `AbstractBaseUser`.
- **`CustomUserManager`** is a custom manager that provides methods for creating users and superusers.
  - `create_user`: Used to create a regular user with email and password.
  - `create_superuser`: Used to create a superuser with additional flags (`is_staff`, `is_superuser`).
- The `CustomUser` model defines an `email` field as the primary user identifier (instead of `username`), and it includes `is_staff`, `is_active`, and `date_joined` fields.

### Important Attributes:
- **`USERNAME_FIELD`**: This defines the field that will be used for authentication. In this example, we are using `email` instead of `username`.
- **`REQUIRED_FIELDS`**: A list of fields that must be set when creating a user via `createsuperuser` command or programmatically. In this case, we are specifying `email` as a required field, as it is the main identifier.

---

## Customizing the Authentication Process

Since `AbstractBaseUser` is very flexible, you can fully customize the authentication process. For example, you can use `email` instead of `username` for login. If you decide to use `email` as the identifier, make sure to set `USERNAME_FIELD = 'email'` in your custom model, as shown in the example above.

In addition, you can implement custom user validation, password policies, or login methods as needed by overriding existing methods or adding your own.

---

## Migrating with `AbstractBaseUser`

When creating a custom user model with `AbstractBaseUser`, you need to ensure that the database is aware of your custom model. To do so, you must define your custom user model in `settings.py`:

```python
# settings.py

AUTH_USER_MODEL = 'myapp.CustomUser'
```

Once this is done, you can run migrations to create the required database tables:

1. Generate migration files:
    ```bash
    python manage.py makemigrations
    ```

2. Apply the migrations:
    ```bash
    python manage.py migrate
    ```

### Important Notes:
- **Timing**: It is critical to define your custom user model early in the project, preferably before running `migrate` for the first time, as changing the user model after migrations are applied can be challenging.
- **Database Compatibility**: Custom user models can be more difficult to change once the application is running in production, so plan your user model structure carefully before proceeding.

---

## Conclusion

The `AbstractBaseUser` model is a flexible, low-level foundation for building custom user models in Django. It provides the essential fields and methods for authentication but leaves the rest of the user model up to you. If you need complete control over the fields and structure of your user model, `AbstractBaseUser` is the best choice.

You can define your own fields, override authentication methods, and fully customize the user model to meet your application’s requirements. However, creating a custom user model from scratch requires careful consideration, especially regarding the timing of migrations and the authentication process.

---
