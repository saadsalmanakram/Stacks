# Generated by Django 5.1.3 on 2024-11-10 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="student",
            name="address",
            field=models.TextField(blank=True, null=True),
        ),
    ]