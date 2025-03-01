use diesel::prelude::*;
use juniper::{GraphQLInputObject, GraphQLObject};
use crate::schema::tags; // Import du schéma Diesel
use crate::establish_connection; // Fonction de connexion à la BDD

/// Définition du type GraphQL pour Tags
#[derive(Queryable, GraphQLObject)]
pub struct Tag {
    pub id: i64,
    pub entity_type: String,
    pub entity_id: i64,
    pub title: String,
}

/// Structure pour créer un Tag via GraphQL
#[derive(GraphQLInputObject)]
pub struct NewTagInput {
    pub entity_type: String,
    pub entity_id: i64,
    pub title: String,
}

/// Implémentation des résolveurs GraphQL pour Tags
pub struct TagQuery;

#[juniper::graphql_object]
impl TagQuery {
    /// Récupérer tous les tags
    fn tags() -> Vec<Tag> {
        use crate::schema::tags::dsl::*;
        let connection = &mut establish_connection();
        tags
            .load::<Tag>(connection)
            .expect("Erreur lors de la récupération des tags")
    }
}

pub struct TagMutation;

#[juniper::graphql_object]
impl TagMutation {
    /// Ajouter un nouveau tag
    fn create_tag(input: NewTagInput) -> Tag {
        use crate::schema::tags::dsl::*;

        let connection = &mut establish_connection();
        let new_tag = Tag {
            id: 0,
            entity_type: input.entity_type,
            entity_id: input.entity_id,
            title: input.title,
        };

        diesel::insert_into(tags)
            .values((
                entity_type.eq(new_tag.entity_type.clone()),
                entity_id.eq(new_tag.entity_id),
                title.eq(new_tag.title.clone()),
            ))
            .execute(connection)
            .expect("Erreur lors de l'insertion du tag");

        new_tag
    }
}
