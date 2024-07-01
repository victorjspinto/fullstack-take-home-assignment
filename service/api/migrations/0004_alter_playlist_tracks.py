# Generated by Django 4.1.5 on 2024-06-30 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_playlist'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlist',
            name='tracks',
            field=models.ManyToManyField(blank=True, null=True, related_name='track', to='api.track'),
        ),
    ]
