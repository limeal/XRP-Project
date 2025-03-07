import { gql } from '@apollo/client'

// Login Mutation
export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`

// Signup Mutation
export const SIGNUP_MUTATION = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`

export const LINK_CROSSMARK = gql`
  mutation LinkCrossmark($userId: String!) {
    linkCrossmark(userId: $userId) {
      success
      walletAddress
      publicKey
      signature
      error
    }
  }
`
