use diesel::prelude::*;
use juniper::{GraphQLInputObject, GraphQLObject};
use crate::db::DbPool;
use crate::schema::item_prices;
use crate::establish_connection;

/// Modèle graphql ItemPrice
#[derive(Queryable, GraphQLObject)]
pub struct ItemPrice {
    pub id: i64,
    pub item_id: i64,
    pub price: f64,
}

/// **Objet GraphQL pour créer un prix**
#[derive(GraphQLInputObject)]
pub struct NewItemPriceInput {
    pub item_id: i64,
    pub price: f64,
}

/// **Objet GraphQL pour mettre à jour un prix**
#[derive(GraphQLInputObject)]
pub struct UpdateItemPriceInput {
    pub id: i64,
    pub price: f64,
}

/// 🎯 **Resolvers GraphQL pour Items**
pub struct ItemPriceQuery;

#[juniper::graphql_object]
impl ItemPriceQuery {
    fn item_prices() -> Vec<ItemPrice> {
        use crate::schema::item_prices::dsl::*;
        let connection = &mut establish_connection();
        item_prices.load::<ItemPrice>(connection).expect("Erreur lors de la récupération des items")
    }
}

/// **Mutations GraphQL pour ItemPrice**
pub struct ItemPriceMutation;

#[juniper::graphql_object(Context = DbPool)]
impl ItemPriceMutation {
    /// **Créer un nouveau prix pour un item**
    fn create_item_price(context: &DbPool, input: NewItemPriceInput) -> ItemPrice {
        let conn = &mut context.get().unwrap();

        let new_price = diesel::insert_into(price)
            .values((
                item_id.eq(input.item_id),
                price.eq(input.price),
            ))
            .get_result::<ItemPrice>(conn)
            .expect("Erreur lors de l'ajout du prix");

        new_price
    }

    /// **Mettre à jour un prix existant**
    fn update_item_price(context: &DbPool, input: UpdateItemPriceInput) -> ItemPrice {
        let conn = &mut context.get().unwrap();

        let updated_price = diesel::update(item_prices.filter(id.eq(input.id)))
            .set(price.eq(input.price))
            .get_result::<ItemPrice>(conn)
            .expect("Erreur lors de la mise à jour du prix");

        updated_price
    }

    /// **Supprimer un prix**
    fn delete_item_price(context: &DbPool, item_price_id: i64) -> bool {
        let conn = &mut context.get().unwrap();

        let deleted_rows = diesel::delete(item_prices.filter(id.eq(item_price_id)))
            .execute(conn)
            .expect("Erreur lors de la suppression du prix");

        deleted_rows > 0
    }
}
