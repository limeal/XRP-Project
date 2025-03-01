use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use diesel::r2d2::{self, ConnectionManager};

pub type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;


pub fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL doit être définie");
    PgConnection::establish(&database_url)
        .expect("Erreur de connexion à la base de données")
}
