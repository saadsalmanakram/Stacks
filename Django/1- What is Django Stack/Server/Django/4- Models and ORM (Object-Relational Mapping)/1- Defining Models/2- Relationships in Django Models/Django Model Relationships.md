
---

## Django Model Relationships 📚

Django models support **three primary types of relationships** to connect different models in a relational database:

1. **One-to-One Relationship** (`OneToOneField`)  
   - Each record in one model is linked to exactly one record in another model.

2. **Many-to-One Relationship** (`ForeignKey`)  
   - Multiple records in one model can be linked to a single record in another model.

3. **Many-to-Many Relationship** (`ManyToManyField`)  
   - Records in one model can be linked to multiple records in another model, and vice versa.

These relationships make it easy to define complex database structures and queries in Django.

---
