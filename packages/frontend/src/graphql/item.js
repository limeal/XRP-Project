import { gql } from '@apollo/client'

export const GET_MONKEY_QUERY = gql`
  query GetMonkey($id: String!) {
    item(id: $id) {
      id
      name
      description
      image_url
      prices {
        price
      }
      owner {
        id
        username
      }
    }
  }
`

export const GET_MONKEYS_QUERY = gql`
  query GetMonkeys {
    items {
      id
      name
      image_url
      prices {
        price
      }
      owner {
        id
        username
      }
    }
  }
`

export const PUT_ITEM_FOR_SALE_MUTATION = gql`
  mutation PutItemForSale($itemId: String!, $price: String!) {
    putItemForSale(itemId: $itemId, price: $price) {
      id
      price
    }
  }
`
