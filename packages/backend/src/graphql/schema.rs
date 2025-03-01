use juniper::RootNode;

use crate::graphql::{
    tags::{TagMutation, TagQuery},
    items::{ItemMutation, ItemQuery},
    users::{UserMutation, UserQuery},
    comments::{CommentMutation, CommentQuery},
    item_prices::{ItemPriceQuery, ItemPriceMutation},
};

/// Définition des Queries GraphQL
pub struct QueryRoot;

#[juniper::graphql_object]
impl QueryRoot {
    fn tags() -> TagQuery {
        TagQuery
    }

    fn items() -> ItemQuery {
        ItemQuery
    }

    fn users() -> UserQuery {
        UserQuery
    }

    fn comments() -> CommentQuery {
        CommentQuery
    }

    fn item_prices() -> ItemPriceQuery {
        ItemPriceQuery
    }
}

/// Définition des Mutations GraphQL
pub struct MutationRoot;

#[juniper::graphql_object]
impl MutationRoot {
    fn tag_mutation() -> TagMutation {
        TagMutation
    }

    fn item_mutation() -> ItemMutation {
        ItemMutation
    }

    fn user_mutation() -> UserMutation {
        UserMutation
    }

    fn comment_mutation() -> CommentMutation {
        CommentMutation
    }

    fn item_price_mutation() -> ItemPriceMutation {
        ItemPriceMutation
    }
}

/// Schéma GraphQL Root
pub type Schema = RootNode<'static, QueryRoot, MutationRoot>;

/// Créer un nouveau schéma GraphQL
pub fn create_schema() -> Schema {
    Schema::new(QueryRoot, MutationRoot)
}
