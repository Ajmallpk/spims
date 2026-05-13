import time

from django.core.cache import cache


MESSAGE_LIMIT = 5

TIME_WINDOW = 10



def is_rate_limited(user_id):

    cache_key = f"chat_rate_limit_{user_id}"

    user_messages = cache.get(
        cache_key,
        []
    )

    current_time = time.time()

    user_messages = [
        msg_time
        for msg_time in user_messages
        if current_time - msg_time < TIME_WINDOW
    ]

    if len(user_messages) >= MESSAGE_LIMIT:

        return True

    user_messages.append(current_time)

    cache.set(
        cache_key,
        user_messages,
        timeout=TIME_WINDOW
    )

    return False