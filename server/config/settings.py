import os
from pathlib import Path

from decouple import config as env, Csv

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = env("DJANGO_SECRET_KEY", "dev-insecure-change-me")
DEBUG = env("DJANGO_DEBUG", "true").lower() == "true"
ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1", cast=Csv())

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "graphene_django",
    "corsheaders",
    "users",
    "collect_ease",
    "recycle_market",
    "finance",
    "platform_core",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DB_ENGINE = env("DB_ENGINE", "django.db.backends.sqlite3")
DATABASES = {
    "default": {
        "ENGINE": DB_ENGINE,
        "NAME": env("DB_NAME", str(BASE_DIR / "db.sqlite3")),
        "USER": env("DB_USER", ""),
        "PASSWORD": env("DB_PASSWORD", ""),
        "HOST": env("DB_HOST", ""),
        "PORT": env("DB_PORT", ""),
    }
}
# Postgres (e.g. Neon) needs SSL; a persistent connection avoids reconnecting
# on every request. Neon's serverless endpoint requires sslmode=require.
if "postgresql" in DB_ENGINE:
    DATABASES["default"]["OPTIONS"] = {"sslmode": env("DB_SSLMODE", "require")}
    DATABASES["default"]["CONN_MAX_AGE"] = env("DB_CONN_MAX_AGE", 600, cast=int)

AUTH_USER_MODEL = "users.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Dar_es_Salaam"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

GRAPHENE = {
    "SCHEMA": "config.schema.schema",
    "MIDDLEWARE": [
        "graphql_jwt.middleware.JSONWebTokenMiddleware",
    ],
}

AUTHENTICATION_BACKENDS = [
    "graphql_jwt.backends.JSONWebTokenBackend",
    "django.contrib.auth.backends.ModelBackend",
]

CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS", "http://localhost:3000", cast=Csv())

# --- Email (Resend) ---
# A Resend API key doubles as the SMTP password, so we accept it under either
# name and prefer the HTTP API (more robust than SMTP on hosts that block port
# 465). The "from" address must be on a Resend-verified domain (methynix.com).
RESEND_API_KEY = env("RESEND_API_KEY", "") or env("SMTP_PASS", "")
DEFAULT_FROM_EMAIL = env("EMAIL_FROM", env("DEFAULT_FROM_EMAIL", "WasteLink <info@methynix.com>"))

# SMTP fallback — only used when no Resend key is set. Resend uses
# smtp.resend.com:465 (SSL). Otherwise the console backend prints codes to the
# terminal during development.
EMAIL_HOST = env("SMTP_HOST", env("EMAIL_HOST", ""))
if EMAIL_HOST:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST_USER = env("SMTP_USER", env("EMAIL_HOST_USER", "resend"))
    EMAIL_HOST_PASSWORD = env("SMTP_PASS", env("EMAIL_HOST_PASSWORD", ""))
    EMAIL_PORT = env("SMTP_PORT", 465, cast=int)
    if EMAIL_PORT == 465:
        EMAIL_USE_SSL = True
    else:
        EMAIL_USE_TLS = True
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# --- Payments ---
# No mobile-money gateway keys yet, so mobile money is disabled and cash is the
# working option. Flip to "true" once AzamPay (or another gateway) is wired up.
PAYMENTS_MOBILE_ENABLED = env("PAYMENTS_MOBILE_ENABLED", "false").lower() == "true"

# --- Meseji SMS ---
MESEJI_API_KEY = env("MESEJI_API_KEY", "")
MESEJI_SENDER_ID = env("MESEJI_SENDER_ID", "WASTECH")

# --- AzamPay ---
AZAMPAY_APP_NAME = env("AZAMPAY_APP_NAME", "")
AZAMPAY_CLIENT_ID = env("AZAMPAY_CLIENT_ID", "")
AZAMPAY_CLIENT_SECRET = env("AZAMPAY_CLIENT_SECRET", "")
