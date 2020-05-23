# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.utils import timezone

from .models import TodoItem

def index(request):
    context = {
        "items": TodoItem.objects.filter(status=TodoItem.STATUS.open,start__lte=timezone.now())
    }

    return render(request, "todo/index.html", context)


def complete(request, item_id):
    item = TodoItem.objects.get(pk=item_id)
    item.status = TodoItem.STATUS.complete
    item.save()

    return index(request)


def cancel(request, item_id):
    item = TodoItem.objects.get(pk=item_id)
    item.status = TodoItem.STATUS.cancelled
    item.save()

    return index(request)

def fail(request, item_id):
    item = TodoItem.objects.get(pk=item_id)
    item.status = TodoItem.STATUS.failed
    item.save()

    return index(request)
