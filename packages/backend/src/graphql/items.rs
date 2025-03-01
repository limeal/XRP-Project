use diesel::prelude::*;
use juniper::{GraphQLInputObject, GraphQLObject};
use crate::schema::items;
use crate::establish_connection;

/// 🎯 **Modèle GraphQL pour Items**
#[derive(Queryable, GraphQLObject)]
pub struct Item {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub xrp_id: String,
    pub image: Option<String>,
    pub owner_id: i64,
}

/// 🎯 **Input pour créer un Item**
#[derive(GraphQLInputObject)]
pub struct NewItemInput {
    pub name: String,
    pub description: Option<String>,
    pub xrp_id: String,
    pub image: Option<String>,
    pub owner_id: i64,
}

/// 🎯 **Resolvers GraphQL pour Items**
pub struct ItemQuery;

#[juniper::graphql_object]
impl ItemQuery {
    fn items() -> Vec<Item> {
        use crate::schema::items::dsl::*;
        let connection = &mut establish_connection();
        items.load::<Item>(connection).expect("Erreur lors de la récupération des items")
    }
}

pub struct ItemMutation;

#[juniper::graphql_object]
impl ItemMutation {
    fn create_item(input: NewItemInput) -> Item {
        use crate::schema::items::dsl::*;
        let connection = &mut establish_connection();

        let new_item = Item {
            id: 0,
            name: input.name,
            description: input.description,
            xrp_id: input.xrp_id,
            image: input.image,
            owner_id: input.owner_id,
        };

        diesel::insert_into(items)
            .values((
                name.eq(new_item.name.clone()),
                description.eq(new_item.description.clone()),
                xrp_id.eq(new_item.xrp_id.clone()),
                image.eq(new_item.image.clone()),
                owner_id.eq(new_item.owner_id),
            ))
            .execute(connection)
            .expect("Erreur lors de l'insertion de l'item");

        new_item
    }
}
