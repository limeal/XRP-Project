use diesel::prelude::*;
use crate::schema::comment;

#[derive(Queryable)]
pub struct Comment {
    pub id: i64,
    pub entity_type: Option<String>,
    pub entity_id: i64,
    pub body: Option<String>,
}