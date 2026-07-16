import logging
from datetime import datetime, timedelta

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

AUTH_URL = "https://authenticator.azampay.co.tz/AppRegistration/GenerateToken"
CHECKOUT_URL = "https://checkout.azampay.co.tz/azampay/mno/checkout"

# Simple in-process token cache (fine for single-worker dev; use Redis in prod)
_token_cache: dict = {"token": None, "expires": datetime.min}


def _get_token() -> str:
    global _token_cache
    if _token_cache["token"] and datetime.utcnow() < _token_cache["expires"]:
        return _token_cache["token"]
    resp = requests.post(
        AUTH_URL,
        json={
            "appName": settings.AZAMPAY_APP_NAME,
            "clientId": settings.AZAMPAY_CLIENT_ID,
            "clientSecret": settings.AZAMPAY_CLIENT_SECRET,
        },
        timeout=15,
    )
    resp.raise_for_status()
    data = resp.json()
    token = data["data"]["accessToken"]
    _token_cache = {
        "token": token,
        "expires": datetime.utcnow() + timedelta(minutes=55),
    }
    return token


def _detect_provider(phone: str) -> str:
    """Map a Tanzanian phone number to its AzamPay MNO provider name."""
    clean = phone.lstrip("+")
    if clean.startswith("255"):
        clean = "0" + clean[3:]
    prefix = clean[:3]
    return {
        "075": "Vodacom",
        "076": "Vodacom",
        "077": "Vodacom",
        "078": "Vodacom",
        "068": "Airtel",
        "069": "Airtel",
        "071": "Tigo",
        "067": "Tigo",
        "073": "TTCL",
        "074": "Halotel",
    }.get(prefix, "Vodacom")


def _normalize_phone(phone: str) -> str:
    """Return phone in local 07XXXXXXXX format expected by AzamPay."""
    p = phone.lstrip("+")
    if p.startswith("255"):
        p = "0" + p[3:]
    return p


def initiate_checkout(phone: str, amount: str, external_id: str) -> dict:
    """
    Trigger a USSD push (MNO checkout) for the given phone and amount.
    external_id must be unique per transaction — used for callback matching.
    Returns the AzamPay response dict.
    """
    token = _get_token()
    p = _normalize_phone(phone)
    resp = requests.post(
        CHECKOUT_URL,
        json={
            "accountNumber": p,
            "amount": str(amount),
            "currency": "TZS",
            "externalId": external_id,
            "provider": _detect_provider(p),
        },
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()
