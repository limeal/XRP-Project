use diesel::prelude::*;
use crate::schema::tag;

#[derive(Queryable)]
pub struct Tag {
    pub id: i64,
    pub entity_type: Option<String>,
    pub entity_id: i64,
    pub title: Option<String>,
}