import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
  useMutation,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import jwt from 'jsonwebtoken';
import { onError } from '@apollo/client/link/error';
import { fromPromise, ApolloLink } from 'apollo-link';

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV == 'production'
      ? 'https://www.severinjakob.com/graphql'
      : 'http://severinjakob.local/graphql',
});

const REFRESH_TOKEN_MUTATION = gql`
  mutation REFRESH_TOKEN_MUTATION($token: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $token }) {
      authToken
    }
  }
`;

const refreshAuthToken = (refreshToken) => {
  console.log('get refresh token');
  console.log(refreshToken);
  localStorage.removeItem('token');

  return client
    .mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { token: refreshToken },
    })
    .then((response) => {
      // extract your accessToken from your response data and return it
      console.log(response);
      const { authToken } = response.data.refreshJwtAuthToken;
      return authToken;
    });
};

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists

  const token = localStorage.getItem('token');

  // if (token) {
  //   jwt.verify(token, 'jsdnfsdkjfnsdkjfsdkjfnkj', (err, decoded) => {
  //     if (err) {
  //       console.log('JWT ERROR');
  //       // localStorage.clear();
  //     }
  //   });
  // }

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    for (let err of graphQLErrors) {
      console.log(err);
      switch (err.extensions.category) {
        case 'user':
          let errorPath = err.path[0];

          if (errorPath == 'refreshJwtAuthToken') {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            break;
          }

          const refreshToken = localStorage.getItem('refreshToken');

          return fromPromise(
            refreshAuthToken(refreshToken).catch((error) => {
              // Handle token refresh errors e.g clear stored tokens, redirect to login
              console.log(error);
              return;
            })
          )
            .filter((value) => {
              console.log(value);
              return Boolean(value);
            })
            .flatMap((accessToken) => {
              console.log(accessToken);
              localStorage.setItem('token', accessToken);
              const oldHeaders = operation.getContext().headers;
              // modify the operation context with a new token
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${accessToken}`,
                },
              });

              // retry the request, returning the new observable
              return forward(operation);
            });
      }
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
