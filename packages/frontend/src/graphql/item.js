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
