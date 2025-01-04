### for_user:

- **Arguments**: user
- **Purpose**: Returns all permissions assigned to the given user.
- **Usage**: It is used to get all the permissions for a specific user.

#### Example:

```python
def for_user(self, user):
    return self.filter(user=user)
