import { gql } from '@apollo/client'

export const GET_USER_QUERY = gql`
  query getUser($id: String!) {
    user(id: $id) {
      id
      username
      items {
        id
        name
        description
        image_url
        prices {
          price
        }
      }
    }
  }
`
