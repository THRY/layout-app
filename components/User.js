import { useLazyQuery, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    user(id: "dXNlcjox") {
      jwtAuthToken
    }
  }
`;

export function useUser() {
  const userId = localStorage.getItem('user');

  console.log('fetching su user');

  const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {
    variables: {
      id: userId ? userId : 'aaaaaaa',
    },
  });

  console.log(data);

  return data?.user;
}
