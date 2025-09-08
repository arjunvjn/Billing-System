from sqlalchemy.orm import Session, selectinload, joinedload

from .models import Order, OrderItem
from product.models import Product
from .schemas import OrderRequest
from .exceptions import OutOfStock, InsufficientAmount
from product.exceptions import ProductNotFound


def create_order(db: Session, request_body: OrderRequest):
    try:
        order = Order(
            customer_email=request_body.customer_email,
            net_amount_without_tax=0,
            net_tax_amount=0,
            paid_amount=request_body.paid_amount,
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        order_items = []
        net_amount_without_tax = 0
        net_tax_amount = 0
        for order_item in request_body.order_items:
            product = (
                db.query(Product)
                .filter(Product.product_id == order_item.product_id)
                .first()
            )
            if product:
                if order_item.quantity <= product.available_stocks:
                    product.available_stocks -= order_item.quantity
                    amount_without_tax = order_item.quantity * product.price_per_unit
                    net_amount_without_tax += amount_without_tax
                    tax_amount = (
                        order_item.quantity
                        * product.price_per_unit
                        * product.tax_percentage
                        * 0.01
                    )
                    net_tax_amount += tax_amount
                    order_item_obj = OrderItem(
                        order_id=order.id,
                        product_id=product.id,
                        quantity=order_item.quantity,
                        tax_amount=tax_amount,
                        amount_without_tax=amount_without_tax,
                    )
                    order_items.append(order_item_obj)
                else:
                    raise OutOfStock(
                        f"Product with product_id {order_item.product_id} is out of stock"
                    )
            else:
                raise ProductNotFound(
                    f"Product with product_id {order_item.product_id} not found"
                )
        if request_body.paid_amount >= (net_amount_without_tax + net_tax_amount):
            order.net_amount_without_tax = net_amount_without_tax
            order.net_tax_amount = net_tax_amount
        else:
            raise InsufficientAmount(
                f"Required Amount: {(net_amount_without_tax + net_tax_amount)}"
            )
        db.add_all(order_items)
        db.commit()
        return order.id
    except (Exception, OutOfStock, ProductNotFound, InsufficientAmount) as e:
        db.rollback()
        if order and order.id:
            db.delete(order)
            db.commit()
        raise e


def get_order_details(db: Session, order_id: int):
    return (
        db.query(Order)
        .filter(Order.id == order_id)
        .options(selectinload(Order.order_items).joinedload(OrderItem.product))
        .first()
    )


def list_orders(db: Session, user_email: str = None):
    if user_email:
        return (
            db.query(Order)
            .filter(Order.customer_email == user_email)
            .order_by(Order.created_at.desc(), Order.id.desc())
            .all()
        )
    return db.query(Order).order_by(Order.created_at.desc(), Order.id.desc()).all()
