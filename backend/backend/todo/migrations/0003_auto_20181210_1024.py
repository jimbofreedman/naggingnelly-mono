# Generated by Django 2.0.9 on 2018-12-10 10:24

from django.db import migrations
import recurrence.fields


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_auto_20181210_0833'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='todoitem',
            options={'ordering': ('order',)},
        ),
        migrations.AddField(
            model_name='todoitem',
            name='recurrence',
            field=recurrence.fields.RecurrenceField(blank=True, null=True),
        ),
    ]