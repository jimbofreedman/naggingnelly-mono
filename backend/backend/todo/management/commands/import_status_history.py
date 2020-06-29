from django.core.management.base import BaseCommand, CommandError
from backend.todo.models import TodoItem, TodoRecurrenceLog
from datetime import timedelta

class Command(BaseCommand):
    def handle(self, *args, **options):
        for t in TodoItem.objects.all():
            t.status_history = None
            t.status_history_start = None
            t.save()

            ts = TodoRecurrenceLog.objects.filter(item=t).order_by("due")
            if (len(ts)):
                print(t.title)
                tf = ts.first()

                t.status_history = []
                t.status_history_start = ts.first().due.date()

                current_date = t.status_history_start

                for s in ts:
                    while (current_date < s.due.date()):
                        print(current_date)
                        t.status_history.append(TodoItem.STATUS.open)
                        current_date = current_date + timedelta(days=1)

                    print(s.due, s.status)
                    t.status_history.append(s.status)
                    current_date = current_date + timedelta(days=1)

                print(t.status_history)
                t.save()
