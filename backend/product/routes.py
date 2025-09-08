from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from . import crud
from .schemas import ProductCreate, ProductUpdate, ProductResponse
from .exceptions import ProductAlreadyExists, ProductNotFound

router = APIRouter(prefix="/products", tags=["Product"])


@router.get("/", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return crud.get_products(db)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_product(request_body: ProductCreate, db: Session = Depends(get_db)):
    try:
        crud.create_product(db, request_body)
        return "Product Created"
    except ProductAlreadyExists as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.put("/{id}")
def update_product(id: int, request_body: ProductUpdate, db: Session = Depends(get_db)):
    try:
        crud.update_product(db, id, request_body)
        return "Product Updated"
    except ProductAlreadyExists as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ProductNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.delete("/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    try:
        crud.delete_product(db, id)
        return "Product Deleted"
    except ProductNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
