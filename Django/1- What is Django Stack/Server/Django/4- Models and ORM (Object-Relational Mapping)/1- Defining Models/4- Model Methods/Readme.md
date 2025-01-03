# 📋 Model Methods

You can add custom methods to your models.

### Example

```python
class Product(models.Model)
    name = models.CharField(max_length=100)
    price = models.FloatField()

    def discounted_price(self, discount)
        return self.price  (1 - discount)
