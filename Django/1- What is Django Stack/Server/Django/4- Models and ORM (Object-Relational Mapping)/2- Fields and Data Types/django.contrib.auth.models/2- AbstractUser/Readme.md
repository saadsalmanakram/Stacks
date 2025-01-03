
---

# Django `AbstractUser` Model Documentation

## Overview
The `AbstractUser` model is a subclass of the `User` model provided by Django’s `django.contrib.auth` framework. It is used as a base model for custom user models. The `AbstractUser` model contains all of the fields and methods of the `User` model, but it provides flexibility for customization. You can subclass `AbstractUser` to add custom fields or modify the existing ones to suit the needs of your application.

If you need to extend the default `User` model with additional fields (such as phone numbers, addresses, etc.), the `AbstractUser` model is the best choice. It is a more customizable option compared to directly modifying the `User` model, as it allows you to add your custom fields while maintaining the built-in user features.

---

## Fields in the `AbstractUser` Model

The `AbstractUser` model inherits all of the fields from the `User` model. Therefore, all the fields of the `User` model are available in `AbstractUser` by default, and they can be customized further if needed.

### Default Fields Inherited from `User` Model:
1. `username`
2. `first_name`
3. `last_name`
4. `email`
5. `password`
6. `groups`
7. `user_permissions`
8. `is_staff`
9. `is_active`
10. `is_superuser`
11. `last_login`
12. `date_joined`

These fields behave in the same way as they do in the `User` model, but you can modify them if needed by overriding the class.

### Additional Fields for Customization

By subclassing `AbstractUser`, you can add custom fields for user-specific data that isn't included by default in the `User` model. For example, adding a `phone_number` or `address` field can be done by simply adding them in the subclass.

### Example of Custom `AbstractUser` Model with Extra Fields:

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
```

In this example, the `CustomUser` model has two additional fields: `phone_number` and `address`. These fields are optional (`null=True`, `blank=True`), and they can be used for storing user-specific information.

---

## Methods of the `AbstractUser` Model

Since `AbstractUser` inherits from the `User` model, it has all the same methods and attributes. Below is a summary of the commonly used methods, which can also be customized if necessary:

### 1. `set_password(raw_password)`
- **Description**: Sets a new password for the user, hashing the password for security.
- **Usage**: This method is useful for setting the password securely when creating or updating a user.

### 2. `check_password(raw_password)`
- **Description**: Verifies whether the given password matches the stored password.
- **Usage**: This method is used for authentication.

### 3. `get_full_name()`
- **Description**: Returns the user’s full name, which is the combination of `first_name` and `last_name`.
- **Usage**: This can be used for displaying the user's full name in the UI.

### 4. `get_short_name()`
- **Description**: Returns the user’s short name, typically the `first_name`.
- **Usage**: This is often used for personalization or when displaying the user's name in a more concise form.

### 5. `has_perm(perm)`
- **Description**: Checks if the user has a specific permission.
- **Usage**: Used to verify whether a user has a specific permission.

### 6. `has_perms(perm_list)`
- **Description**: Checks if the user has a list of permissions.
- **Usage**: Used when checking for multiple permissions.

### 7. `has_module_perms(app_label)`
- **Description**: Checks if the user has permission to access any models in a given app.
- **Usage**: Useful for checking app-level access.

### 8. `is_authenticated`
- **Description**: A boolean that indicates if the user is authenticated.
- **Usage**: Can be used in templates and views to check if a user is logged in.

---

## Customizing the `AbstractUser` Model

When you subclass `AbstractUser`, you create a completely new user model, and Django will use this custom model instead of the default `User` model. You must specify your custom user model in the `AUTH_USER_MODEL` setting in `settings.py`:

### Example of Customizing the User Model:

```python
# settings.py

AUTH_USER_MODEL = 'myapp.CustomUser'
```

Here, `myapp` is the name of your Django app, and `CustomUser` is the name of your subclassed model. Once set, Django will use the `CustomUser` model for authentication, user creation, and other user-related operations.

---

## Migrating with Custom User Models

When using a custom user model, it is important to create and apply the database migrations properly. After creating your custom user model, run the following commands to generate and apply migrations:

1. Generate migration files:
    ```bash
    python manage.py makemigrations
    ```

2. Apply the migrations to the database:
    ```bash
    python manage.py migrate
    ```

### Important Notes:

- **Timing**: If you want to use a custom user model, you must define it **before** you run the `migrate` command for the first time. This is crucial because Django uses the user model as a base for creating various authentication-related tables in the database.
- **Database Compatibility**: Changing the user model after running migrations can be complicated, so it's best to decide on your custom user model early in the project.

---

## Example of a Full Custom User Model

Here’s an example of a fully customized `AbstractUser` model with additional fields, methods, and custom behavior:

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)

    def get_full_name(self):
        # Override to include address in full name
        return f"{self.first_name} {self.last_name}, {self.address}"

    def is_legal_age(self):
        from datetime import date
        return (date.today() - self.date_of_birth).days >= 18 * 365
```

In this example:
- `phone_number`, `address`, and `date_of_birth` are added to the user model.
- The `get_full_name` method is overridden to include the address in the full name.
- A custom method `is_legal_age` is created to check whether the user is legally an adult based on their date of birth.

---

## Conclusion

The `AbstractUser` model is a flexible, customizable base for building user models in Django. It contains all of the fields and methods from the default `User` model, while allowing for easy extensions with additional fields and methods. By subclassing `AbstractUser`, you can tailor the user model to the specific requirements of your application while retaining all of the built-in authentication and permission management features.

If you need to add custom fields or modify the default behavior, `AbstractUser` is the ideal solution.

---
