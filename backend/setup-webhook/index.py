import json
import os
import urllib.request

WEBHOOK_URL = "https://functions.poehali.dev/e5ea13ae-4089-4736-8814-bc699f9b49e2"
TG_API = "https://api.telegram.org/bot"

H = {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}


def tg(path):
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    with urllib.request.urlopen(f"{TG_API}{token}/{path}", timeout=10) as r:
        return json.loads(r.read().decode())


def handler(event: dict, context) -> dict:
    """
    GET /         — статус webhook
    GET /?set=1   — зарегистрировать webhook (вызвать один раз)
    """
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    if not token:
        return {"statusCode": 500, "headers": H, "body": {"error": "TELEGRAM_BOT_TOKEN не задан"}}

    params = event.get("queryStringParameters", {}) or {}

    if params.get("set") == "1":
        result = tg(f"setWebhook?url={WEBHOOK_URL}")
        return {"statusCode": 200, "headers": H, "body": result}

    info = tg("getWebhookInfo")
    return {"statusCode": 200, "headers": H, "body": info}