# 📘 What is a Django Model and How to Create It

## 📖 What is a Django Model?
A **Django model** is a **Python class** that represents the structure of your database table. It defines the fields, behaviors, and relationships of your data and provides a powerful way to interact with the database using Django's **Object-Relational Mapping (ORM)**. With models, you can perform CRUD (Create, Read, Update, Delete) operations without writing raw SQL queries.

### Key Features of Django Models:
- Automatically creates tables in the database.
- Provides field types to define data attributes (e.g., `CharField`, `IntegerField`, `DateField`).
- Manages database relationships using foreign keys, one-to-one, and many-to-many fields.
- Offers built-in methods to query and manipulate data efficiently.

---

## 🛠️ How to Create a Django Model

Creating a Django model involves a few simple steps. Here's a quick guide to get you started:

### ✅ Step 1: Define Your Model in `models.py`
In your Django app, open the `models.py` file and define your model class.

```python
from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=50)
    published_date = models.DateField()
    isbn_number = models.CharField(max_length=13)

    def __str__(self):
        return self.title
```

### ✅ Step 2: Make Migrations
After defining your model, you need to create migrations to apply the changes to the database.

```bash
python manage.py makemigrations
```

### ✅ Step 3: Apply Migrations
Apply the migrations to create the table in the database.

```bash
python manage.py migrate
```

### ✅ Step 4: Use the Model in Your Project
You can now interact with your model using Django's ORM.

```python
from myapp.models import Book

# Create a new book entry
book = Book.objects.create(
    title="Django for Beginners",
    author="William S. Vincent",
    published_date="2025-01-03",
    isbn_number="9781735467221"
)

# Query all books
books = Book.objects.all()

# Filter books by author
books_by_author = Book.objects.filter(author="William S. Vincent")
```

---

## 🔎 Example Explained
- **`title`**: A string field to store the book's title.
- **`author`**: A string field to store the author's name.
- **`published_date`**: A date field to store the publication date.
- **`isbn_number`**: A string field to store the book's ISBN number.
- **`__str__` method**: Returns the book's title when the object is printed.

---
