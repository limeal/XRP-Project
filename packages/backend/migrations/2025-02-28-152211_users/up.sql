-- Your SQL goes here

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    xrp_address VARCHAR,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR NOT NULL,
    entity_id BIGINT NOT NULL,
    title VARCHAR NOT NULL
);

CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR,
    xrp_id VARCHAR NOT NULL UNIQUE,
    image VARCHAR,
    owner_id BIGINT NOT NULL,
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE item_prices (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR NOT NULL,
    entity_id BIGINT NOT NULL,
    body VARCHAR NOT NULL
);
