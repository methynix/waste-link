import logging

import requests
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

RESEND_ENDPOINT = "https://api.resend.com/emails"


def send_email(to: str, subject: str, message: str) -> bool:
    """Send a plain-text email.

    Uses the Resend HTTP API when RESEND_API_KEY is set (the same key/domain
    you already use on methynix.com). Otherwise falls back to Django's mail
    backend — the console backend in dev prints the message to the terminal,
    so OTP codes stay visible while testing.
    """
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@methynix.com")
    api_key = getattr(settings, "RESEND_API_KEY", "")

    if api_key:
        try:
            resp = requests.post(
                RESEND_ENDPOINT,
                json={
                    "from": from_email,
                    "to": [to],
                    "subject": subject,
                    "text": message,
                },
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                timeout=10,
            )
            resp.raise_for_status()
            logger.info("Email sent to %s via Resend (id=%s)", to, resp.json().get("id"))
            return True
        except requests.RequestException as exc:
            logger.error("Resend email failed for %s: %s", to, exc)
            return False

    # No Resend key — fall back to Django's configured backend (console in dev).
    try:
        send_mail(subject, message, from_email, [to], fail_silently=False)
        logger.info("Email queued for %s via Django backend", to)
        return True
    except Exception as exc:  # noqa: BLE001 — log any backend failure, don't crash the request
        logger.error("Email send failed for %s: %s", to, exc)
        return False
