from sqlalchemy.orm import Session

from .models import Product
from .schemas import ProductCreate, ProductUpdate
from .exceptions import ProductAlreadyExists, ProductNotFound


def get_products(db: Session):
    return db.query(Product).all()


def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()


def create_product(db: Session, request_body: ProductCreate):
    try:
        existing = (
            db.query(Product)
            .filter(Product.product_id == request_body.product_id)
            .first()
        )
        if existing:
            raise ProductAlreadyExists("Product with this product_id already exists.")
        product = Product(**request_body.model_dump())
        db.add(product)
        db.commit()
        return
    except Exception:
        db.rollback()
        raise


def update_product(db: Session, product_id: int, request_body: ProductUpdate):
    try:
        product = get_product(db, product_id)
        if not product:
            raise ProductNotFound(f"Product with id {product_id} not found")
        if request_body.product_id:
            existing = (
                db.query(Product)
                .filter(
                    Product.id != product_id,
                    Product.product_id == request_body.product_id,
                )
                .first()
            )
            if existing:
                raise ProductAlreadyExists(
                    "Product with this product_id already exists."
                )
        update_data = request_body.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        db.commit()
        return
    except Exception:
        db.rollback()
        raise


def delete_product(db: Session, product_id: int):
    try:
        product = get_product(db, product_id)
        if not product:
            raise ProductNotFound(f"Product with id {product_id} not found")
        db.delete(product)
        db.commit()
        return
    except Exception:
        db.rollback()
        raise
