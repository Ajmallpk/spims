import requests

from django.core.management.base import BaseCommand

from apps.accounts.models import Panchayath, Ward


class Command(BaseCommand):
    help = "Import Kerala Wards"

    def handle(self, *args, **kwargs):

        panchayaths = Panchayath.objects.exclude(
            html_page__isnull=True
        ).exclude(
            html_page=""
        )

        total = panchayaths.count()

        self.stdout.write(
            self.style.SUCCESS(
                f"Found {total} Panchayaths"
            )
        )

        for index, panchayath in enumerate(panchayaths, start=1):

            self.stdout.write(f"[{index}/{total}] {panchayath.name}")

            try:

                json_url = panchayath.html_page.replace(".html", ".json")

                response = requests.get(json_url, timeout=30)

                if response.status_code != 200:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Could not download {panchayath.name}"
                        )
                    )
                    continue

                geojson = response.json()

                imported = 0

                for feature in geojson.get("features", []):

                    props = feature.get("properties", {})

                    # Import only Gram Panchayaths
                    if props.get("Lsgd_Type") != "Grama Panchayat":
                        continue

                    Ward.objects.get_or_create(
                        panchayath=panchayath,
                        ward_number=props["Ward_No"],
                        defaults={
                            "ward_name": props["Ward_Name"],
                            "code": f"{panchayath.id}_{props['Ward_No']}"
                        }
                    )

                    imported += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Imported {imported} wards"
                    )
                )

            except Exception as e:

                self.stdout.write(
                    self.style.ERROR(
                        f"{panchayath.name} -> {e}"
                    )
                )