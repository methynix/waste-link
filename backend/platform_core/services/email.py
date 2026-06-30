import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, message: str) -> bool:
    """Send a plain-text email. Returns True if Django accepted it for delivery.

    In development (no SMTP configured) Django's console backend prints the
    message to the terminal, so the OTP is still visible while testing.
    """
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@wastelink.co.tz")
    try:
        send_mail(subject, message, from_email, [to], fail_silently=False)
        logger.info("Email queued for %s", to)
        return True
    except Exception as exc:  # noqa: BLE001 — log any backend failure, don't crash the request
        logger.error("Email send failed for %s: %s", to, exc)
        return False
