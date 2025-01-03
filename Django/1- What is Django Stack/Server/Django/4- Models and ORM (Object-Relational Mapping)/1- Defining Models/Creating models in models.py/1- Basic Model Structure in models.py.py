from django.db import models

class ModelName(models.Model):
    field1 = models.FieldType(arguments)
    field2 = models.FieldType(arguments)

    class Meta:
        # Additional options for the model
        ordering = ['-created_at']  # Example of ordering by a field
        verbose_name = "Custom Model Name"

    def __str__(self):
        return self.field1  # String representation of the model
