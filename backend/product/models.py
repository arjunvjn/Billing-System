from sqlalchemy import Column, Integer, String, Float, CheckConstraint
from sqlalchemy.orm import relationship

from database import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    product_id = Column(String, nullable=False, unique=True, index=True)
    available_stocks = Column(Integer, nullable=False)
    price_per_unit = Column(Float, nullable=False)
    tax_percentage = Column(Float, nullable=False)

    order_items = relationship(
        "OrderItem", back_populates="product", passive_deletes=True
    )

    __table_args__ = (
        CheckConstraint('available_stocks >= 0', name='ck_available_stocks_non_negative'),
        CheckConstraint('price_per_unit > 0', name='ck_price_per_unit_positive'),
        CheckConstraint('tax_percentage > 0', name='ck_tax_percentage_positive'),
    )
