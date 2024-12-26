from django.db import models

class Custom(models.Model):
	city = models.CharField(max_length=100, blank=True, null=True)
	state = models.CharField(max_length=100, blank=True, null=True)
	address = models.TextField(blank=True, null=True)
	phone = models.CharField(max_length=15, blank=True, null=True)

	def __str__(self):
		return self.username