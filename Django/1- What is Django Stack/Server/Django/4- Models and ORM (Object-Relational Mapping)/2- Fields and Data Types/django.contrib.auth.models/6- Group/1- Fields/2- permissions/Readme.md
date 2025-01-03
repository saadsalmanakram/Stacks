### permissions: ManyToManyField

- **Related model**: Permission (from `django.contrib.auth.models.Permission`)
- **Required**: False
- **Description**: A many-to-many relationship to the `Permission` model. This allows the group to have multiple permissions associated with it. A group can have zero or more permissions.
