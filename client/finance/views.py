import json
import logging

from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import DepositRequest, Transaction

logger = logging.getLogger(__name__)


@csrf_exempt
@require_POST
def azampay_callback(request):
    """
    AzamPay posts here after a MNO checkout completes.
    We match on utilityref (our external_id), credit the wallet, and record a transaction.
    """
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"status": "error", "detail": "bad JSON"}, status=400)

    logger.info("AzamPay callback received: %s", data)

    # AzamPay sends utilityref or externalId as the key matching our external_id
    external_id = data.get("utilityref") or data.get("externalId") or data.get("external_id")
    if not external_id:
        return JsonResponse({"status": "error", "detail": "missing utilityref"}, status=400)

    try:
        deposit = DepositRequest.objects.get(azampay_external_id=external_id, status="pending")
    except DepositRequest.DoesNotExist:
        # Already processed or unknown — respond 200 so AzamPay stops retrying
        return JsonResponse({"status": "ok"})

    message = (data.get("message") or "").lower()
    tran_id = data.get("tranId") or data.get("reference") or ""

    if "success" in message or data.get("transactionStatus", "").lower() == "success":
        deposit.status = "completed"
        deposit.azampay_transaction_id = tran_id
        deposit.completed_at = timezone.now()
        deposit.save()

        wallet = deposit.wallet
        wallet.balance += deposit.amount
        wallet.save(update_fields=["balance", "updated_at"])

        Transaction.objects.create(
            wallet=wallet,
            transaction_type="deposit",
            amount=deposit.amount,
            reference=f"azampay-{tran_id or external_id}",
            status="completed",
        )
        logger.info("Deposit completed: wallet=%s amount=%s", wallet.id, deposit.amount)
    else:
        deposit.status = "failed"
        deposit.save(update_fields=["status"])
        logger.warning("Deposit failed for external_id=%s data=%s", external_id, data)

    return JsonResponse({"status": "ok"})
