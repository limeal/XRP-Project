use diesel::prelude::*;
use crate::schema::users;

#[derive(Queryable)]
pub struct User {
    pub id: i64,
    pub username: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
    pub xrp_address: Option<String>,
    pub last_login_at: Option<chrono::NaiveDateTime>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}