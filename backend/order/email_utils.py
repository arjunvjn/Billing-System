import os
from email.message import EmailMessage
import aiosmtplib
from dotenv import load_dotenv
import math

from .schemas import OrderDetails

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def format_order_email(order: OrderDetails):
    lines = [
        f"Order Confirmation - #{order.id}",
        f"Date: {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}",
        f"Customer Email: {order.customer_email}",
        "",
        "Items:",
    ]

    for item in order.order_items:
        product = item.product
        product_name = product.name if product else "Unknown Product"
        lines.append(
            f"- {product_name} | Qty: {item.quantity} | "
            f"Price: {item.amount_without_tax:.2f} | Tax: {item.tax_amount:.2f}"
        )

    lines.append("")
    lines.append(f"Subtotal: ${order.net_amount_without_tax:.2f}")
    lines.append(f"Tax: ${order.net_tax_amount:.2f}")
    lines.append(
        f"Net Price: ${math.floor(order.net_amount_without_tax + order.net_tax_amount)}"
    )
    lines.append(f"Total Paid: ${order.paid_amount}")
    lines.append(
        f"Balance to Return: ${order.paid_amount - math.floor(order.net_amount_without_tax + order.net_tax_amount)}"
    )

    return "\n".join(lines)


async def send_email(subject: str, recipient: str, body: str):
    message = EmailMessage()
    message["From"] = EMAIL_USERNAME
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body)

    await aiosmtplib.send(
        message,
        hostname=EMAIL_HOST,
        port=EMAIL_PORT,
        start_tls=True,
        username=EMAIL_USERNAME,
        password=EMAIL_PASSWORD,
    )
