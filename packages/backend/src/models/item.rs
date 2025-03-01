use diesel::prelude::*;
use crate::schema::item;

#[derive(Queryable)]
pub struct Item {
    pub id: i64,
    pub name: i64,
    pub description: String,
    pub xrp_id: Option<String>,
    pub image: String,
    pub owner_id: i64,
}