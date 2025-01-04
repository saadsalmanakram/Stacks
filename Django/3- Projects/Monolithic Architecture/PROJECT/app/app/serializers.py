from rest_framework import serilaizers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
	class Meta:
		model = Product
		fields = ["id", "name", "slug", "image", "description", "category", "price"]

		