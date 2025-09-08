from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database import Base


class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc))
    customer_email = Column(String, nullable=False)
    net_amount_without_tax = Column(Float, nullable=False)
    net_tax_amount = Column(Float, nullable=False)
    paid_amount = Column(Float, nullable=False)

    order_items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint('net_amount_without_tax >= 0', name='ck_net_amount_without_tax_non_negative'),
        CheckConstraint('net_tax_amount >= 0', name='ck_net_tax_amount_non_negative'),
        CheckConstraint('paid_amount >= 0', name='ck_paid_amount_non_negative'),
    )


class OrderItem(Base):

    __tablename__ = "orderitems"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(
        Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False
    )
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"))
    quantity = Column(Integer, nullable=False)
    amount_without_tax = Column(Float, nullable=False)
    tax_amount = Column(Float, nullable=False)

    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

    __table_args__ = (
        CheckConstraint('quantity > 0', name='ck_quantity_positive'),
        CheckConstraint('amount_without_tax >= 0', name='ck_amount_without_tax_non_negative'),
        CheckConstraint('tax_amount >= 0', name='ck_tax_amount_non_negative'),
    )