import { gql } from '@apollo/client'

// Query to get user details
export const GET_USER_QUERY = gql`
  query getUser($id: String!) {
    user(id: $id) {
      id
      username
      email
      created_at
      items {
        id
        name
        description
        image_url
      }
    }
  }
`
