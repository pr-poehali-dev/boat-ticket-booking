import json
import os
import psycopg2
import random
import string
from datetime import datetime

SCHEMA = "t_p82742348_boat_ticket_booking"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def resp(status, data, headers=None):
    h = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Phone, X-Admin-Key",
        "Content-Type": "application/json",
    }
    if headers:
        h.update(headers)
    return {"statusCode": status, "headers": h, "body": data}

def gen_code():
    date_str = datetime.now().strftime("%Y%m%d")
    suffix = "".join(random.choices(string.digits, k=4))
    return f"RGT-{date_str}-{suffix}"

def handler(event: dict, context) -> dict:
    """
    API для бронирований:
    POST / — создать бронь
    GET /  — получить брони по телефону (заголовок X-User-Phone)
    GET /?admin=1 — все брони (для админки, проверяется X-Admin-Key)
    """
    if event.get("httpMethod") == "OPTIONS":
        return resp(200, "")

    method = event.get("httpMethod", "GET")
    headers = event.get("headers", {}) or {}
    params = event.get("queryStringParameters", {}) or {}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        format_ = body.get("format", "").strip()
        trip_date = body.get("date", "").strip()
        name = body.get("name", "").strip()
        phone = body.get("phone", "").strip()
        email = body.get("email", "").strip()

        if not all([format_, trip_date, name, phone]):
            return resp(400, {"error": "Заполните все обязательные поля"})

        conn = get_conn()
        cur = conn.cursor()

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (phone, email, name) VALUES (%s, %s, %s) "
            f"ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email RETURNING id",
            (phone, email or None, name),
        )
        user_id = cur.fetchone()[0]

        ticket_code = gen_code()
        cur.execute(
            f"INSERT INTO {SCHEMA}.bookings (ticket_code, user_id, format, trip_date, passenger_name, phone, email) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, ticket_code, created_at",
            (ticket_code, user_id, format_, trip_date, name, phone, email or None),
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return resp(200, {
            "id": row[0],
            "ticket_code": row[1],
            "created_at": row[2].isoformat(),
            "format": format_,
            "trip_date": trip_date,
            "passenger_name": name,
            "phone": phone,
            "email": email,
        })

    if method == "GET":
        admin_key = headers.get("x-admin-key") or headers.get("X-Admin-Key") or params.get("admin_key", "")
        if params.get("admin") == "1":
            expected = os.environ.get("ADMIN_KEY", "")
            if not expected or admin_key != expected:
                return resp(403, {"error": "Нет доступа"})

            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                f"SELECT id, ticket_code, format, trip_date, passenger_name, phone, email, status, created_at "
                f"FROM {SCHEMA}.bookings ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            cur.close()
            conn.close()
            return resp(200, {"bookings": [
                {
                    "id": r[0], "ticket_code": r[1], "format": r[2],
                    "trip_date": str(r[3]), "passenger_name": r[4],
                    "phone": r[5], "email": r[6] or "", "status": r[7],
                    "created_at": r[8].isoformat(),
                }
                for r in rows
            ]})

        phone = headers.get("x-user-phone") or headers.get("X-User-Phone") or params.get("phone", "")
        if not phone:
            return resp(400, {"error": "Укажите телефон"})

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, ticket_code, format, trip_date, passenger_name, phone, email, status, created_at "
            f"FROM {SCHEMA}.bookings WHERE phone = %s ORDER BY created_at DESC",
            (phone,),
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return resp(200, {"bookings": [
            {
                "id": r[0], "ticket_code": r[1], "format": r[2],
                "trip_date": str(r[3]), "passenger_name": r[4],
                "phone": r[5], "email": r[6] or "", "status": r[7],
                "created_at": r[8].isoformat(),
            }
            for r in rows
        ]})

    return resp(405, {"error": "Method not allowed"})
