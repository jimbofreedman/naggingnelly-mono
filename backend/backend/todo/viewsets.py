from rest_framework import viewsets, permissions

from .serializers import ContextSerializer, TodoItemSerializer
from .models import Context, TodoItem

class ContextViewSet(viewsets.ModelViewSet):
    queryset = Context.objects.all()
    serializer_class = ContextSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Context.objects.all()

class TodoItemViewSet(viewsets.ModelViewSet):
    resource_name = 'todo-items'
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TodoItem.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
