# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Context, TodoItem

admin.site.register(Context)
admin.site.register(TodoItem)
