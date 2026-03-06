from django.apps import AppConfig


class CitizenConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = 'apps.citizen'
    
    def ready(self):
        import apps.citizen.signals
