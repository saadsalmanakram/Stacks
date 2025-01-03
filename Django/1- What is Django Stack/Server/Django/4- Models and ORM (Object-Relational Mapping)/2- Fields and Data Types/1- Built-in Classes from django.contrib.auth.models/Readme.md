
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
