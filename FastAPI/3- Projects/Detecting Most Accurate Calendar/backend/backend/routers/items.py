from fastapi import APIRouter
from schemas.item import Item

router = APIRouter()

@router.post("/items/")
def create_item(item: Item):
    return {"item_name": item.name}