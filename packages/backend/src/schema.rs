// @generated automatically by Diesel CLI.

diesel::table! {
    comments (id) {
        id -> Int8,
        entity_type -> Varchar,
        entity_id -> Int8,
        body -> Varchar,
    }
}

diesel::table! {
    item_prices (id) {
        id -> Int8,
        item_id -> Int8,
        price -> Numeric,
    }
}

diesel::table! {
    items (id) {
        id -> Int8,
        name -> Varchar,
        description -> Nullable<Varchar>,
        xrp_id -> Varchar,
        image -> Nullable<Varchar>,
        owner_id -> Int8,
    }
}

diesel::table! {
    tags (id) {
        id -> Int8,
        entity_type -> Varchar,
        entity_id -> Int8,
        title -> Varchar,
    }
}

diesel::table! {
    users (id) {
        id -> Int8,
        username -> Varchar,
        email -> Varchar,
        password -> Varchar,
        xrp_address -> Nullable<Varchar>,
        last_login_at -> Nullable<Timestamp>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(item_prices -> items (item_id));
diesel::joinable!(items -> users (owner_id));

diesel::allow_tables_to_appear_in_same_query!(
    comments,
    item_prices,
    items,
    tags,
    users,
);
