from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, TextField
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel

class User(AbstractUser, TimeStampedModel):

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = CharField(_("Name of User"), blank=True, max_length=255)

    togglApiToken = CharField(blank=True, null=True, max_length=32)
    goals = TextField(blank=True, null=True)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})
