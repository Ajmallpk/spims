from django.apps import AppConfig


class WardConfig(AppConfig):
    name = 'apps.ward'
    
    
    
    def ready(self):
        import apps.ward.signals
