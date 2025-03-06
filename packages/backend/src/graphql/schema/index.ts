const typeDefs = `#graphql
  scalar BigInt
  scalar DateTime
  scalar Upload

  # Un seul type User pour tous, avec les champs publics uniquement
  type User {
    id: String!
    username: String!
    items: [Item!]!
  }

  type Item {
    id: String!
    name: String!
    description: String!
    xrp_id: String
    image_url: String!
    owner_id: String!
    owner: User!
    comments: [Comment!]!
    tags: [Tag!]!
    prices: [ItemPrice]
    isForSale: Boolean!
  }

  type ItemPrice {
    id: String!
    item_id: String!
    price: BigInt
    item: Item!
  }

  type Comment {
    id: String!
    entity_type: String
    entity_id: String!
    body: String
  }

  type Tag {
    id: String!
    entity_type: String
    entity_id: String!
    title: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: String!): User
    items: [Item!]!
    item(id: String!): Item
    itemPrices: [ItemPrice!]!
    itemPrice(id: String!): ItemPrice
    comments: [Comment!]!
    comment(id: String!): Comment
    tags: [Tag!]!
    tag(id: String!): Tag
    userItems(userId: String!): [Item!]!
    itemsForSale: [Item!]!
  }

  type Mutation {
    signup(
      username: String!
      email: String!
      password: String!
    ): AuthPayload!
    
    login(
      email: String!
      password: String!
    ): AuthPayload!

    updateUser(
      id: String!
      username: String
      email: String
      password: String
      xrp_seed: String
    ): User!
    
    deleteUser(id: String!): User!

    createItem(
      name: String!, 
      description: String!, 
      image: Upload!
    ): Item!

    updateItem(
      id: String!, 
      name: String, 
      description: String, 
      image: String
    ): Item!

    deleteItem(id: String!): Item!

    createItemPrice(item_id: String!, price: BigInt): ItemPrice!
    updateItemPrice(id: String!, price: BigInt): ItemPrice!
    deleteItemPrice(id: String!): ItemPrice!

    createComment(entity_type: String, entity_id: String!, body: String): Comment!
    updateComment(id: String!, body: String): Comment!
    deleteComment(id: String!): Comment!

    createTag(entity_type: String, entity_id: String!, title: String): Tag!
    updateTag(id: String!, title: String): Tag!
    deleteTag(id: String!): Tag!

    putItemForSale(itemId: String!, price: String!): ItemPrice!
    buyItem(itemId: String!): Item!
  }
`;

export default typeDefs;
