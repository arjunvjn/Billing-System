from pydantic import BaseModel, Field
from typing import Optional


class ProductBase(BaseModel):
    name: str
    product_id: str
    available_stocks: int = Field(..., ge=0)
    price_per_unit: float = Field(..., gt=0)
    tax_percentage: float = Field(..., gt=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    product_id: Optional[str] = None
    available_stocks: Optional[int] = Field(None, ge=0)
    price_per_unit: Optional[float] = Field(None, gt=0)
    tax_percentage: Optional[float] = Field(None, gt=0)


class ProductResponse(ProductBase):
    id: int

    model_config = {"from_attributes": True}
