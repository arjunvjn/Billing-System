from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from product.schemas import ProductResponse


class OrderItemBase(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)


class OrderItemRequest(OrderItemBase):
    pass


class OrderItemDetails(OrderItemBase):
    id: int
    quantity: int
    amount_without_tax: float
    tax_amount: float
    product: ProductResponse
    order_id: int
    product_id: int

    model_config = {"from_attributes": True}


class OrderBase(BaseModel):
    customer_email: str
    paid_amount: float = Field(..., gt=0)


class OrderRequest(OrderBase):
    order_items: List[OrderItemRequest]


class OrderList(OrderBase):
    id: int
    created_at: datetime
    net_amount_without_tax: float
    net_tax_amount: float

    model_config = {"from_attributes": True}


class OrderDetails(OrderList):
    order_items: List[OrderItemDetails]

    model_config = {"from_attributes": True}
