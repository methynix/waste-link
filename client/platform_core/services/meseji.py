import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

MESEJI_BASE = "https://meseji.co.tz/api/v1"


def send_sms(phone: str, message: str) -> bool:
    """Send an SMS via the Meseji API. Returns True if successfully queued."""
    api_key = getattr(settings, "MESEJI_API_KEY", "")
    sender_id = getattr(settings, "MESEJI_SENDER_ID", "WASTECH")
    if not api_key:
        logger.warning("MESEJI_API_KEY not configured — SMS not sent to %s", phone)
        return False
    try:
        resp = requests.post(
            f"{MESEJI_BASE}/sms/send",
            json={"sender_id": sender_id, "message": message, "contacts": phone},
            headers={"x-api-key": api_key, "Content-Type": "application/json"},
            timeout=10,
        )
        resp.raise_for_status()
        logger.info("SMS queued for %s (batch_id=%s)", phone, resp.json().get("batch_id"))
        return True
    except requests.RequestException as exc:
        logger.error("Meseji SMS failed for %s: %s", phone, exc)
        return False
