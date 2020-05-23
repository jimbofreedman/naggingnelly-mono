from rest_framework import serializers

from .models import Context, TodoItem


class ContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Context
        fields = ['id', 'name', ]


class TodoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = ['id', 'deleted', 'title', 'start', 'due', 'completed', 'snooze_until', 'order', 'urgency', 'status',
                  'time_estimate', 'contexts', 'project', 'dependencies', 'streak', ]

