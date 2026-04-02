from django.apps import AppConfig


class PanchayathConfig(AppConfig):
    name = 'apps.panchayath'

    
    def ready(self):
        import apps.panchayath.signals