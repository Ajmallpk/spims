import requests

url = "https://wardmap.ksmart.live/files/Wayanad_Poothadi_01JBBD70RWDKT6YWZK0MR6MHBH.json"

response = requests.get(url)

print("Status:", response.status_code)

data = response.json()

print("Type:", data["type"])
print("Features:", len(data["features"]))

first = data["features"][0]["properties"]

print(first.keys())

print(first)