# A ForeignKey creates a relationship where one record in a model is related to many records in another model.

class Author(models.Model):
    name = models.CharField(max_length=100)

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)


# on_delete=models.CASCADE: Deletes the related books if the author is deleted.