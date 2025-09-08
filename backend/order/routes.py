from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from . import crud
from .schemas import OrderRequest, OrderDetails, OrderList
from .exceptions import OutOfStock, InsufficientAmount
from product.exceptions import ProductNotFound
from .email_utils import send_email, format_order_email

router = APIRouter(prefix="/orders", tags=["Order"])


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=OrderDetails)
def create_order(
    background_tasks: BackgroundTasks,
    request_body: OrderRequest,
    db: Session = Depends(get_db),
):
    try:
        order_id = crud.create_order(db, request_body)
        order = crud.get_order_details(db, order_id)
        subject = f"Order Confirmation"
        body = format_order_email(order)
        background_tasks.add_task(send_email, subject, order.customer_email, body)
        return order
    except (OutOfStock, ProductNotFound, InsufficientAmount) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/", response_model=List[OrderList])
def list_orders(user_email: str = None, db: Session = Depends(get_db)):
    return crud.list_orders(db, user_email)


@router.get("/{id}", response_model=OrderDetails)
def order_detail(id: int, db: Session = Depends(get_db)):
    return crud.get_order_details(db, id)
