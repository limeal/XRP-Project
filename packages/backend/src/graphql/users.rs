use diesel::prelude::*;
use juniper::{GraphQLInputObject, GraphQLObject};
use crate::schema::users;
use crate::establish_connection;
use chrono::NaiveDateTime;

/// 🎯 **Modèle GraphQL pour Users**
#[derive(Queryable, GraphQLObject)]
pub struct User {
    pub id: i64,
    pub username: String,
    pub email: String,
    pub password: String,
    pub xrp_address: Option<String>,
    pub last_login_at: Option<chrono::NaiveDateTime>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
}

/// 🎯 **Input pour créer un User**
#[derive(GraphQLInputObject)]
pub struct NewUserInput {
    pub username: String,
    pub email: String,
    pub password: String,
    pub xrp_address: Option<String>,
}

/// 🎯 **Resolvers GraphQL pour Users**
pub struct UserQuery;

#[juniper::graphql_object]
impl UserQuery {
    fn users() -> Vec<User> {
        use crate::schema::users::dsl::*;
        let connection = &mut establish_connection();
        users.load::<User>(connection).expect("Erreur lors de la récupération des utilisateurs")
    }
}

pub struct UserMutation;

#[juniper::graphql_object]
impl UserMutation {
    fn create_user(input: NewUserInput) -> User {
        use crate::schema::users::dsl::*;
        let connection = &mut establish_connection();

        let new_user = User {
            id: 0,
            username: input.username,
            email: input.email,
            password: input.password,
            xrp_address: input.xrp_address,
            last_login_at: None,
            created_at: chrono::Utc::now().naive_utc(),
            updated_at: chrono::Utc::now().naive_utc(),
        };

        diesel::insert_into(users)
            .values((
                username.eq(new_user.username.clone()),
                email.eq(new_user.email.clone()),
                password.eq(new_user.password.clone()),
                xrp_address.eq(new_user.xrp_address.clone()),
            ))
            .execute(connection)
            .expect("Erreur lors de l'insertion de l'utilisateur");

        new_user
    }
}
