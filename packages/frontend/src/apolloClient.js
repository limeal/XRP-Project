import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { BACKEND_URL } from './config.js'

const httpLink = createHttpLink({
  uri: BACKEND_URL,
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Item: {
        fields: {
          prices: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
})
