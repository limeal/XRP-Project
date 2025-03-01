use diesel::prelude::*;
use juniper::{GraphQLInputObject, GraphQLObject};
use crate::schema::comments;
use crate::establish_connection;

/// 🎯 **Modèle GraphQL pour Comments**
#[derive(Queryable, GraphQLObject)]
pub struct Comment {
    pub id: i64,
    pub entity_type: String,
    pub entity_id: i64,
    pub body: String,
}

/// 🎯 **Input pour créer un Comment**
#[derive(GraphQLInputObject)]
pub struct NewCommentInput {
    pub entity_type: String,
    pub entity_id: i64,
    pub body: String,
}

/// 🎯 **Resolvers GraphQL pour Comments**
pub struct CommentQuery;

#[juniper::graphql_object]
impl CommentQuery {
    fn comments() -> Vec<Comment> {
        use crate::schema::comments::dsl::*;
        let connection = &mut establish_connection();
        comments.load::<Comment>(connection).expect("Erreur lors de la récupération des commentaires")
    }
}

pub struct CommentMutation;

#[juniper::graphql_object]
impl CommentMutation {
    fn create_comment(input: NewCommentInput) -> Comment {
        use crate::schema::comments::dsl::*;
        let connection = &mut establish_connection();

        let new_comment = Comment {
            id: 0,
            entity_type: input.entity_type,
            entity_id: input.entity_id,
            body: input.body,
        };

        diesel::insert_into(comments)
            .values((
                entity_type.eq(new_comment.entity_type.clone()),
                entity_id.eq(new_comment.entity_id),
                body.eq(new_comment.body.clone()),
            ))
            .execute(connection)
            .expect("Erreur lors de l'insertion du commentaire");

        new_comment
    }
}
