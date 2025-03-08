import { gql } from '@apollo/client'

export const GET_MONKEY_QUERY = gql`
  query GetMonkey($id: String!) {
    item(id: $id) {
      id
      name
      description
      image_url
      published
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

export const CREATE_ITEM_PRICE_MUTATION = gql`
  mutation CreateItemPrice($itemId: String!, $price: BigInt) {
    createItemPrice(item_id: $itemId, price: $price) {
      id
      price
    }
  }
`

export const BUY_ITEM_MUTATION = gql`
  mutation BuyItem($itemId: String!) {
    buyItem(itemId: $itemId) {
      id
      owner {
        id
        username
      }
      prices {
        id
        price
      }
    }
  }
`

export const PUBLISH_ITEM_MUTATION = gql`
  mutation PublishItem($itemId: String!) {
    publishItem(itemId: $itemId) {
      id
      published
    }
  }
`
