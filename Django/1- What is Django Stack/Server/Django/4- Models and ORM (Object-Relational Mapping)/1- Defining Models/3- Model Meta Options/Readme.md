# Model Meta Options

The `Meta` class inside a model is used to customize the model’s behavior.

| **Option**           | **Description**                                            | **Example**                            |
|----------------------|------------------------------------------------------------|----------------------------------------|
| `ordering`           | Default ordering of records.                               | `ordering = ['-created_at']`           |
| `verbose_name`       | A human-readable name for the model.                       | `verbose_name = "Blog Post"`          |
| `verbose_name_plural`| A human-readable plural name for the model.                 | `verbose_name_plural = "Posts"`       |
| `db_table`           | The database table name for the model.                     | `db_table = 'custom_table'`            |
| `unique_together`    | Enforces a unique constraint on a set of fields.            | `unique_together = ('name', 'email')` |
