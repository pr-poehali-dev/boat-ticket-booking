import json
import os
import psycopg2
import urllib.request

SCHEMA = "t_p82742348_boat_ticket_booking"
TG_API = "https://api.telegram.org/bot"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def tg_send(chat_id, text, parse_mode="HTML"):
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": parse_mode,
    }).encode()
    req = urllib.request.Request(
        f"{TG_API}{token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    urllib.request.urlopen(req)


def get_admin_chat_id():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SELECT value FROM {SCHEMA}.admin_settings WHERE key = 'admin_chat_id'")
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row[0] if row else None


def save_admin_chat_id(chat_id: str):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.admin_settings (key, value) VALUES ('admin_chat_id', %s) "
        f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
        (chat_id,),
    )
    conn.commit()
    cur.close()
    conn.close()


def handler(event: dict, context) -> dict:
    """
    Webhook-обработчик Telegram бота Речгортранса.
    Команды:
      /start — приветствие, сохранение chat_id админа
      /bookings — список последних 10 броней (только для админа)
      /mytickets [телефон] — брони пассажира по телефону
    """
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": ""}

    body = json.loads(event.get("body") or "{}")
    message = body.get("message") or body.get("edited_message")
    if not message:
        return {"statusCode": 200, "body": "ok"}

    chat_id = str(message["chat"]["id"])
    text = message.get("text", "").strip()
    first_name = message["from"].get("first_name", "")

    admin_chat_id = get_admin_chat_id()
    is_admin = chat_id == admin_chat_id

    # /start
    if text.startswith("/start"):
        admin_key = text.replace("/start", "").strip()
        expected = os.environ.get("ADMIN_KEY", "")

        if expected and admin_key == expected:
            save_admin_chat_id(chat_id)
            tg_send(chat_id, (
                f"✅ <b>Привет, {first_name}!</b>\n\n"
                f"Ты подключён как <b>администратор</b> Речгортранса.\n\n"
                f"📋 /bookings — последние бронирования\n"
                f"🔍 /mytickets [телефон] — билеты пассажира"
            ))
        else:
            tg_send(chat_id, (
                f"👋 Привет, <b>{first_name}</b>!\n\n"
                f"Это бот причала <b>Речгортранс</b> в р.п Краснозёрское.\n\n"
                f"🎫 Узнай свои билеты:\n"
                f"/mytickets +79001234567\n\n"
                f"🌊 Бронируй на сайте: rechgortrans.ru"
            ))
        return {"statusCode": 200, "body": "ok"}

    # /bookings — только для админа
    if text.startswith("/bookings"):
        if not is_admin:
            tg_send(chat_id, "⛔ Команда доступна только администратору.")
            return {"statusCode": 200, "body": "ok"}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT ticket_code, format, trip_date, passenger_name, phone, status "
            f"FROM {SCHEMA}.bookings ORDER BY created_at DESC LIMIT 10"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            tg_send(chat_id, "📭 Бронирований пока нет.")
            return {"statusCode": 200, "body": "ok"}

        lines = ["📋 <b>Последние 10 бронирований:</b>\n"]
        for r in rows:
            date_fmt = r[2].strftime("%d.%m") if r[2] else "—"
            status_icon = "✅" if r[5] == "active" else "❌"
            lines.append(
                f"{status_icon} <code>{r[0]}</code>\n"
                f"   🚤 {r[1]}\n"
                f"   📅 {date_fmt} | 👤 {r[3]} | 📞 {r[4]}\n"
            )
        tg_send(chat_id, "\n".join(lines))
        return {"statusCode": 200, "body": "ok"}

    # /mytickets [phone]
    if text.startswith("/mytickets"):
        parts = text.split(maxsplit=1)
        if len(parts) < 2:
            tg_send(chat_id, "📞 Укажи номер телефона:\n/mytickets +79001234567")
            return {"statusCode": 200, "body": "ok"}

        phone = parts[1].strip()
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT ticket_code, format, trip_date, passenger_name, status "
            f"FROM {SCHEMA}.bookings WHERE phone = %s ORDER BY created_at DESC",
            (phone,),
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            tg_send(chat_id, f"🔍 По номеру <code>{phone}</code> билетов не найдено.\n\nПроверь номер или забронируй на сайте.")
            return {"statusCode": 200, "body": "ok"}

        lines = [f"🎫 <b>Твои билеты</b> ({phone}):\n"]
        for r in rows:
            date_fmt = r[2].strftime("%d %B") if r[2] else "—"
            status_icon = "✅" if r[4] == "active" else "❌"
            lines.append(
                f"{status_icon} <code>{r[0]}</code>\n"
                f"   🚤 {r[1]}\n"
                f"   📅 {date_fmt} | 👤 {r[3]}\n"
                f"   📍 Главный причал №13, р.п Краснозёрское\n"
            )
        tg_send(chat_id, "\n".join(lines))
        return {"statusCode": 200, "body": "ok"}

    # Неизвестная команда
    tg_send(chat_id, (
        "🤖 Не понял команду.\n\n"
        "Доступные команды:\n"
        "/mytickets [телефон] — мои билеты\n"
        "/start — начало"
    ))
    return {"statusCode": 200, "body": "ok"}
