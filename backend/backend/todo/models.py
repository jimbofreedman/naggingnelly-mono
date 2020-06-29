# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import datetime, timedelta
from time import time
import calendar

from django.db import models
from django.contrib.postgres.fields import ArrayField
from model_utils.models import TimeStampedModel, StatusModel
from model_utils.fields import StatusField
from model_utils import Choices
from recurrence.fields import RecurrenceField
from django.utils import timezone

from backend.users.models import User


class Context(TimeStampedModel):
    name = models.CharField(max_length=32)

    def __str__(self):
        return self.name


class TodoItem(TimeStampedModel, StatusModel):
    STATUS = Choices('open', 'cancelled', 'failed', 'complete')
    URGENCY = Choices(0, 1, 2, 3, 4, 5)
    TIME_ESTIMATE = Choices('5m', '15m', '30m', '1h', '4h', '1d', '3d', '1w', '5w', '10w', '20w')

    deleted = models.BooleanField(default=False)

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=128)

    start = models.DateTimeField(blank=True, null=True)
    due = models.DateTimeField(blank=True, null=True)
    snooze_until = models.DateTimeField(blank=True, null=True)
    completed = models.DateTimeField(blank=True, null=True)

    order = models.FloatField()

    urgency = models.PositiveSmallIntegerField(choices=URGENCY, blank=True, null=True)
    time_estimate = models.CharField(max_length=3, choices=TIME_ESTIMATE, blank=True, null=True)

    recurrence = RecurrenceField(blank=True, null=True)
    streak = models.PositiveSmallIntegerField(default=0)
    status_history = ArrayField(StatusField(choices_name=STATUS), blank=True, null=True)
    status_history_start = models.DateField(blank=True, null=True)

    contexts = models.ManyToManyField(Context, blank=True)
    project = models.ForeignKey('TodoItem', related_name='members',on_delete=models.PROTECT, blank=True, null=True)
    dependencies = models.ManyToManyField('TodoItem', related_name='dependents', symmetrical=False, blank=True)

    def save(self, *args, **kwargs):
        # If we are new, we need a task order
        if not self.id:
            # Order should gradually creep up over the span of a user's account history
            # So, set it to milliseconds since account creation
            self.order = time() - calendar.timegm(self.owner.created.utctimetuple())

        # If we have just been completed
        if self.status != self.STATUS.open and self.completed is None:
            # Make an TodoRecurrenceLog object for this TodoItem,
            # and reset it with new start/due
            if self.recurrence is not None and len(self.recurrence.rrules) > 0 and self.start:
                self.recurrence.dtstart = timezone.make_aware(datetime.combine(self.due.date(), datetime.min.time()))

                recur_date = self.recurrence.after(self.start, inc=False)

                if recur_date is not None:
                    self.start = timezone.make_aware(datetime.combine(recur_date, self.start.time()))
                    self.due = timezone.make_aware(datetime.combine(recur_date, self.due.time()) if self.due else None)

                    if self.status == self.STATUS.complete:
                        self.streak = self.streak + 1
                    elif self.status == self.STATUS.failed:
                        self.streak = 0

                    if self.status_history is None:
                        self.status_history = [],
                        self.status_history_start = self.due

                    current_date = self.status_history_start + timedelta(days=len(self.status_history))
                    while (current_date < self.due.date()):
                        self.status_history.append(TodoItem.STATUS.open)
                        current_date = current_date + timedelta(days=1)

                    self.status_history.append(self.status)
                    self.status = self.STATUS.open

                else:
                    self.completed = timezone.now()
            else:
                self.completed = timezone.now()

        super(TodoItem , self).save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('order', )


class TodoRecurrenceLog(TimeStampedModel, StatusModel):
    STATUS = TodoItem.STATUS

    item = models.ForeignKey(TodoItem, on_delete=models.CASCADE)

    start = models.DateTimeField(null=True, blank=True)
    due = models.DateTimeField(null=True, blank=True)
