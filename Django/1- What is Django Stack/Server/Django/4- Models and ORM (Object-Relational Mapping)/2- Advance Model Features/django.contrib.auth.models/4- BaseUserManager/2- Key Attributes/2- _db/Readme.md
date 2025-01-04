## _db Property

### Purpose:
This is an internal property in `BaseUserManager` that helps with database routing when working with multiple databases.

---

### Example:

```python
user.save(using=self._db)
