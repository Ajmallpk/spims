import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from apps.accounts.models import District, Panchayath


class Command(BaseCommand):
    help = "Import Kerala Districts and Panchayaths"

    def handle(self, *args, **kwargs):

        json_file = (
            Path(settings.BASE_DIR)
            / "data"
            / "district_localbody_mapping.json"
        )

        if not json_file.exists():
            self.stdout.write(
                self.style.ERROR(f"{json_file} not found")
            )
            return

        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        district_count = 0
        panchayath_count = 0

        for district_name, local_bodies in data.items():

            district, created = District.objects.get_or_create(
                name=district_name,
                defaults={
                    "code": district_name.upper().replace(" ", "_")
                }
            )

            if created:
                district_count += 1

            for body in local_bodies:

                panchayath, created = Panchayath.objects.get_or_create(
                    district=district,
                    name=body["LocalBody"],
                    defaults={
                        "html_page": body["HTMLPage"]
                    }
                )

                if created:
                    panchayath_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Imported {district_count} districts"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Imported {panchayath_count} Panchayaths"
            )
        )