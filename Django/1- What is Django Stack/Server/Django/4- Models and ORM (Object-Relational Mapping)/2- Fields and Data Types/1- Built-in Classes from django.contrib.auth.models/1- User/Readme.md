
---

# Django `User` Model Documentation

## Overview
The `User` model is a built-in model provided by Django as part of the `django.contrib.auth` framework. It represents an authenticated user in your Django application and contains information about their identity, permissions, and authentication details.

This model is typically used for managing user accounts and handling user authentication within your Django project. It comes with a number of fields that allow you to store common attributes like username, email, password, and related information.

---

## Fields in the `User` Model

### 1. `username`
- **Type**: `CharField`
- **Max Length**: `150`
- **Description**: This field stores the username of the user, which is a unique identifier for the user in your application.
- **Usage**: It is used for logging in and identifying the user in the authentication system.
- **Attributes**:
  - Unique: `True`
  - Can be blank: `False`
  - Must be between `1` and `150` characters.

### 2. `first_name`
- **Type**: `CharField`
- **Max Length**: `30`
- **Description**: Stores the first name of the user.
- **Usage**: This field can be used to store a user's first name, which is helpful for personalization.
- **Attributes**:
  - Can be blank: `True`
  
### 3. `last_name`
- **Type**: `CharField`
- **Max Length**: `30`
- **Description**: Stores the last name of the user.
- **Usage**: Used to store a user's last name, useful for displaying full names in the user interface.
- **Attributes**:
  - Can be blank: `True`

### 4. `email`
- **Type**: `EmailField`
- **Max Length**: `254`
- **Description**: Stores the email address of the user.
- **Usage**: Used for email-based login or communication purposes.
- **Attributes**:
  - Can be blank: `True` 
  - Unique: `False` by default (this can be customized to ensure uniqueness if needed)

### 5. `password`
- **Type**: `CharField`
- **Max Length**: `128`
- **Description**: This field stores the hashed password for the user.
- **Usage**: Used for authenticating the user, but the password is stored in a hashed format to ensure security.
- **Attributes**:
  - Can be blank: `False`

### 6. `groups`
- **Type**: `ManyToManyField`
- **Related Model**: `Group`
- **Description**: The groups to which the user belongs. Groups are used to assign a set of permissions to multiple users at once.
- **Usage**: You can assign users to groups to apply permissions collectively to a set of users.
- **Attributes**:
  - Can be empty: `True`

### 7. `user_permissions`
- **Type**: `ManyToManyField`
- **Related Model**: `Permission`
- **Description**: The individual permissions granted to the user.
- **Usage**: This allows you to assign specific permissions (e.g., add, change, or delete records) to the user directly, aside from group-based permissions.
- **Attributes**:
  - Can be empty: `True`

### 8. `is_staff`
- **Type**: `BooleanField`
- **Description**: A flag that indicates whether the user can log into the Django admin site.
- **Usage**: If `True`, the user can access the Django admin interface. This is typically used for admin users.
- **Attributes**:
  - Default: `False`

### 9. `is_active`
- **Type**: `BooleanField`
- **Description**: A flag that indicates whether the user account is active.
- **Usage**: Set to `False` to deactivate a user's account. This is useful if you want to temporarily disable a user without deleting them.
- **Attributes**:
  - Default: `True`

### 10. `is_superuser`
- **Type**: `BooleanField`
- **Description**: A flag that indicates whether the user has all permissions without explicitly assigning them.
- **Usage**: If `True`, the user has unrestricted access to all parts of the site, including user management and other administrative actions.
- **Attributes**:
  - Default: `False`

### 11. `last_login`
- **Type**: `DateTimeField`
- **Description**: Stores the date and time of the last login of the user.
- **Usage**: This is updated automatically whenever the user logs in.
- **Attributes**:
  - Can be `null`: `True`

### 12. `date_joined`
- **Type**: `DateTimeField`
- **Description**: The date and time when the user account was created.
- **Usage**: This is typically set automatically when the user is created.
- **Attributes**:
  - Can be `null`: `True`

---

## Methods of the `User` Model

The `User` model comes with several useful methods that can be used to perform actions related to authentication and user management.

### 1. `set_password(raw_password)`
- **Description**: Sets a new password for the user, which is hashed.
- **Usage**: This method is used to set the password securely. It automatically hashes the password before storing it in the database.

### 2. `check_password(raw_password)`
- **Description**: Checks whether the given password matches the stored password.
- **Usage**: This method is used to verify that the entered password matches the stored password for authentication.

### 3. `get_full_name()`
- **Description**: Returns the user's full name, combining the `first_name` and `last_name` fields.
- **Usage**: Used to get a user's full name, helpful for displaying the name in user interfaces.

### 4. `get_short_name()`
- **Description**: Returns the user's short name, typically the `first_name`.
- **Usage**: Useful when displaying a brief version of the user's name.

### 5. `has_perm(perm)`
- **Description**: Checks whether the user has a specific permission.
- **Usage**: Used to check if the user has a specific permission, either directly or via groups.

### 6. `has_perms(perm_list)`
- **Description**: Checks whether the user has a list of permissions.
- **Usage**: Used to check if the user has all permissions in the list.

### 7. `has_module_perms(app_label)`
- **Description**: Checks whether the user has permission to access a particular app.
- **Usage**: Used to check if a user can access any models within a given app.

### 8. `is_authenticated`
- **Description**: A boolean attribute that indicates whether the user is authenticated.
- **Usage**: Returns `True` if the user is authenticated and `False` otherwise. This is useful in templates and views.

---

## User Creation and Authentication

To create a new user, you can use the `User` model's `create_user` method, which automatically hashes the password for security. Here's an example of creating a new user:

```python
from django.contrib.auth.models import User

# Create a new user
user = User.objects.create_user('john_doe', 'john@example.com', 'password123')

# Set first and last name
user.first_name = 'John'
user.last_name = 'Doe'
user.save()
```

For authentication, you can use the Django authentication system. Here's an example of how to authenticate a user:

```python
from django.contrib.auth import authenticate, login

# Authenticate user
user = authenticate(username='john_doe', password='password123')

if user is not None:
    # User is authenticated, log them in
    login(request, user)
else:
    # Invalid credentials
    print("Invalid login details")
```

---

## Conclusion

The `User` model from `django.contrib.auth.models` is a powerful tool for managing users in Django applications. It comes with several built-in fields and methods that allow you to efficiently handle user authentication, permissions, and profiles. Customizing and extending this model is also possible to suit your specific needs by subclassing the `AbstractUser` class.

--- 
