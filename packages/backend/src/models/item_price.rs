use diesel::prelude::*;
use crate::schema::item_price;

#[derive(Queryable)]
pub struct ItemPrice {
    pub id: i64,
    pub item_id: i64,
    pub price: Option<i64>,
}