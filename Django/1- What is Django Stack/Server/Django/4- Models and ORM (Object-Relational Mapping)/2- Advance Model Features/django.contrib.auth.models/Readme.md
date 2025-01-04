
---

## 🔍 **Built-in Classes from `django.contrib.auth.models`**

| **Class**               | **Description**                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------|
| **User**                 | The default user model provided by Django.                                                           |
| **AbstractUser**         | An abstract base class for a fully-featured user model with fields like username, email, and password. |
| **AbstractBaseUser**     | A minimal abstract base class that provides authentication-related functionality.                     |
| **BaseUserManager**      | A base class for creating custom user model managers.                                                 |
| **PermissionsMixin**     | A mixin that provides group, permission, and superuser-related fields to a user model.                |
| **Group**                | A model that represents a group of users with shared permissions.                                     |
| **Permission**           | A model that represents a specific permission that can be assigned to users or groups.                |
| **AnonymousUser**        | A class that represents a user who is not authenticated.                                              |
| **PermissionManager**    | A manager for handling `Permission` objects.                                                         |

---

### 🔎 **1. `User`**

The default user model used by Django when you don’t specify a custom user model.

**Example:**

```python
from django.contrib.auth.models import User

user = User.objects.create_user(username='saadsalman', password='mypassword')
```

---

### 🔎 **2. `AbstractUser`**

An abstract class that you can extend to create a custom user model while keeping all default fields and functionalities.

**Example:**

```python
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=15, blank=True)
```

---

### 🔎 **3. `AbstractBaseUser`**

A minimal base class that you can use to create a completely custom user model. It provides password and login-related functionality.

**Example:**

```python
from django.contrib.auth.models import AbstractBaseUser

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
```

---

### 🔎 **4. `BaseUserManager`**

A base class for creating custom user model managers, used to define how users and superusers are created.

**Example:**

```python
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        user = self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user
```

---

### 🔎 **5. `PermissionsMixin`**

A mixin that adds permission-related fields and methods to your user model, such as `groups`, `user_permissions`, and `is_superuser`.

**Example:**

```python
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
```

---

### 🔎 **6. `Group`**

A model that represents a group of users who share common permissions. You can assign users to groups and manage permissions through these groups.

**Example:**

```python
from django.contrib.auth.models import Group

group = Group.objects.create(name='Editors')
```

---

### 🔎 **7. `Permission`**

A model that represents a specific permission that can be assigned to users or groups.

**Example:**

```python
from django.contrib.auth.models import Permission

permission = Permission.objects.get(codename='add_user')
```

---

### 🔎 **8. `AnonymousUser`**

A class that represents a user who is not authenticated. Django automatically uses this class for unauthenticated users.

**Example:**

```python
from django.contrib.auth.models import AnonymousUser

user = AnonymousUser()
print(user.is_authenticated)  # False
```

---

### 🔎 **9. `PermissionManager`**

A manager for handling `Permission` objects. It provides methods to retrieve and manage permissions.

**Example:**

```python
from django.contrib.auth.models import Permission

permissions = Permission.objects.all()
```

---

### 🔍 **Summary of Key Built-in Classes:**

| **Class**             | **Primary Use**                                              |
|-----------------------|--------------------------------------------------------------|
| `User`                | Default user model                                           |
| `AbstractUser`        | Customizable user model with built-in fields                 |
| `AbstractBaseUser`    | Minimal base class for custom user models                    |
| `BaseUserManager`     | Custom manager for user models                               |
| `PermissionsMixin`    | Adds permissions, groups, and superuser fields               |
| `Group`               | Represents a group of users with shared permissions          |
| `Permission`          | Represents a specific permission                             |
| `AnonymousUser`       | Represents an unauthenticated user                           |
| `PermissionManager`   | Handles `Permission` objects                                 |

---


### WHEN TO USE WHICH ONE...

---

## ✅ **1. `models.Model`**  
This is the base class for all Django models. You use it **any time you create a new database model** in your Django project.

### 🔧 **When to use:**
- **Whenever you create any custom model in your project** (e.g., `BlogPost`, `Product`, `Profile`, etc.).
- It provides ORM functionality like querying, creating, updating, and deleting records.

### ✅ **Example:**
```python
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    bio = models.TextField()
```

---

## ✅ **2. `User`**  
This is Django’s **default user model**. It includes fields like `username`, `email`, `password`, etc.

### 🔧 **When to use:**
- **If you don't need a custom user model**, you can use this directly for authentication.
- Ideal for simple projects where default fields are sufficient.

### ❌ **When NOT to use:**
- If you need to customize fields like `email` as the login identifier or add additional fields to the user.

### ✅ **Example:**
```python
from django.contrib.auth.models import User

user = User.objects.create_user(username='saad', password='password123')
```

---

## ✅ **3. `AbstractUser`**  
This is a **customizable version of the `User` model**. It includes default fields but allows you to **extend** them by subclassing it.

### 🔧 **When to use:**
- **When you need to add custom fields** (e.g., `phone_number`) to the user model but still want the default `User` functionality.

### ✅ **Example:**
```python
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15)
```

---

## ✅ **4. `AbstractBaseUser`**  
This is the **most customizable option**. It provides only the core functionality (password hashing and authentication) but **no fields like `username` or `email`**. You must define everything yourself.

### 🔧 **When to use:**
- When you need **full control** over the user model fields.
- Useful for projects where `email` is the username or you need an entirely different user identification system.

### ✅ **Example:**
```python
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
```

---

## ✅ **5. `BaseUserManager`**  
This is a **manager class for custom user models**. It provides methods to create users (`create_user` and `create_superuser`).

### 🔧 **When to use:**
- **Whenever you implement a custom user model** using `AbstractBaseUser`.
- It helps manage how users are created in your application.

### ✅ **Example:**
See the `CustomUserManager` example above.

---

## ✅ **6. `PermissionsMixin`**  
This **adds support for groups and permissions** to a user model. It provides fields like `is_superuser`, `groups`, and `user_permissions`.

### 🔧 **When to use:**
- **When building a custom user model** and you want it to support Django’s permission framework.

### ✅ **Example:**
```python
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
```

---

## ✅ **7. `Group`**  
This represents a **group of users** in Django. Groups are used to manage permissions collectively.

### 🔧 **When to use:**
- When you need to **assign the same permissions to multiple users** at once.
- For example, a group called "Editors" can be given permission to edit blog posts.

### ✅ **Example:**
```python
from django.contrib.auth.models import Group

editors_group = Group.objects.create(name='Editors')
```

---

## ✅ **8. `Permission`**  
This class represents **individual permissions** in Django. Permissions are used to control access to specific parts of your application.

### 🔧 **When to use:**
- When you need to create **custom permissions** for models.
- For example, you can add a permission like `can_publish_post`.

### ✅ **Example:**
```python
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

content_type = ContentType.objects.get_for_model(Post)
permission = Permission.objects.create(
    codename='can_publish_post',
    name='Can Publish Post',
    content_type=content_type,
)
```

---

## ✅ **9. `AnonymousUser`**  
This represents a **non-authenticated user**. Django automatically uses this for users who haven't logged in.

### 🔧 **When to use:**
- When you need to handle **unauthenticated users** in your views.

### ✅ **Example:**
```python
from django.contrib.auth.models import AnonymousUser

if request.user == AnonymousUser:
    print("User is not logged in")
```

---

## ✅ **10. `PermissionManager`**  
This is a **manager class** for the `Permission` model. It provides methods to **fetch and manage permissions**.

### 🔧 **When to use:**
- When you need to **query or manage permissions programmatically**.

### ✅ **Example:**
```python
from django.contrib.auth.models import Permission

permissions = Permission.objects.all()
```

---

## 🔄 **Quick Summary Table:**

| Class              | Purpose                               | When to Use                                            |
|--------------------|---------------------------------------|-------------------------------------------------------|
| `models.Model`     | Base class for all models              | Whenever creating a new model                        |
| `User`             | Default user model                    | For simple projects without customization             |
| `AbstractUser`     | Customizable user model               | When you need custom fields but keep default behavior |
| `AbstractBaseUser` | Fully customizable user model         | When you need complete control over the user model    |
| `BaseUserManager`  | Manager for custom user models        | Whenever you use `AbstractBaseUser`                  |
| `PermissionsMixin` | Adds groups and permissions support   | When building custom user models with permissions     |
| `Group`            | Represents a group of users           | To assign the same permissions to multiple users      |
| `Permission`       | Represents an individual permission   | To create and manage custom permissions              |
| `AnonymousUser`    | Represents non-authenticated users    | To handle unauthenticated users in views             |
| `PermissionManager`| Manager for `Permission` objects      | To manage permissions programmatically               |

---

If you need a custom implementation based on your project’s structure, I can help you draft it! 😊