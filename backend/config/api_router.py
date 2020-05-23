from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from backend.users.api.views import UserViewSet
from backend.todo.viewsets import ContextViewSet, TodoItemViewSet

router = DefaultRouter()

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register(r'contexts', ContextViewSet)
router.register(r'todo-items', TodoItemViewSet)


app_name = "api"
urlpatterns = router.urls
