//! Actix Web + Juniper + Diesel Example
//!
//! Ce projet intègre GraphQL avec Juniper et une base de données PostgreSQL via Diesel.

use std::{io, sync::Arc};
use diesel::prelude::*;
use diesel::pg::PgConnection;
use dotenvy::dotenv;
use std::env;
use actix_cors::Cors;
use actix_web::{
    get, middleware, route,
    web::{self, Data},
    App, HttpResponse, HttpServer, Responder,
};
use juniper::http::{graphiql::graphiql_source, GraphQLRequest};
use crate::graphql::schema::{create_schema, Schema};

mod schema;  // Pour Diesel
mod graphql; // Pour GraphQL
mod db;

/// Fonction pour établir la connexion à PostgreSQL
pub fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL doit être définie");
    PgConnection::establish(&database_url)
        .expect("Erreur de connexion à la base de données")
}

/// Point d'entrée vers GraphiQL (interface pour tester les requêtes GraphQL)
#[get("/graphiql")]
async fn graphql_playground() -> impl Responder {
    web::Html::new(graphiql_source("/graphql", None))
}

/// Endpoint GraphQL
#[route("/graphql_api", method = "GET", method = "POST")]
async fn graphql_api(st: web::Data<Schema>, data: web::Json<GraphQLRequest>) -> impl Responder {
    let response = data.execute(&st, &()).await;
    HttpResponse::Ok().json(response)
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Connexion à PostgreSQL
    let conn = establish_connection();
    println!("Connexion à PostgreSQL réussie !");

    // Création du schéma GraphQL
    let schema = Arc::new(create_schema());

    log::info!("Serveur en cours d'exécution sur http://localhost:8080");
    log::info!("GraphiQL disponible sur http://localhost:8080/graphiql");

    // Démarrage du serveur HTTP
    HttpServer::new(move || {
        App::new()
            .app_data(Data::from(schema.clone()))
            .service(graphql)
            .service(graphql_playground)
            .wrap(Cors::permissive())
            .wrap(middleware::Logger::default())
    })
    .workers(2)
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
