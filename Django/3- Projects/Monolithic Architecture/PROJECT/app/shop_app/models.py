from django.db import models
from django.utils.text import slugify

# Create your models here.

class Product(models.Model):
	CATEGORY = (("Electronics", "ELECTRONS"),
		        ("Groceries", "GROCERIES"),
		        ("Clothings", "CLOTHINGS")
		        )

	name = models.CharField(max_length=100)
	slug = models.SlugField(blank=True, null=True)
	image = models.ImageField(upload_to="img")
	description = models.TextField(blank=True, null=True)
	price = models.DecimalField(max_digits=10, decimal_places=2)
	category = models.CharField(max_length=15, choices=CATEGORY, blank=True, null=True)


	def __str__(self):
		return self.name


	def save(self, *args, **kwargs):

		if not self.slug:
			self.slug = slugify(self.name)
			unique_slug = self.slug
			counter = 1
			if Product.object.filter(slug=unique_slug).exists():
				unique_slug = f'{self.slug}-{counter}'
				counter += 1
			self.slug = unique_slug

		super().save(*args, **kwargs)

