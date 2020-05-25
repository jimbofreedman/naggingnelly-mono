from django.utils import dateparse
from datetime import datetime

from rest_framework import filters
from rest_framework.exceptions import ValidationError


class ModifiedSinceFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'If-Modified-Since' not in request.headers:
            return queryset.all()

        str_modified_since = request.headers.get('If-Modified-Since')
        # This is a terrible datetime format, but it's the standard for If-Modified-Since
        modified_since = datetime.strptime(str_modified_since[:-6], "%a %b %d %Y %H:%M:%S GMT%z")
        if modified_since is None:
            raise ValidationError("Could not parse modified_since")

        return queryset.filter(modified__gt=modified_since)
