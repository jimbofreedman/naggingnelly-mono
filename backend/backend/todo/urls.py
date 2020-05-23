from django.urls import path, include
# from django.urls import url, include
from rest_framework.routers import DefaultRouter

from .views import index, complete, cancel, fail
from .viewsets import ContextViewSet, TodoItemViewSet

app_name = "todo"

router = DefaultRouter()
router.register(r'contexts', ContextViewSet, base_name='contexts')
router.register(r'todo-items', TodoItemViewSet, base_name='todo-items')

urlpatterns = [
    path("", include(router.urls)),
]
