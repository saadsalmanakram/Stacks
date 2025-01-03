# A ManyToManyField creates a relationship where multiple records in one model are related to multiple records in another model.

class Student(models.Model):
    name = models.CharField(max_length=100)

class Course(models.Model):
    title = models.CharField(max_length=100)
    students = models.ManyToManyField(Student)
