import { useQuery, gql } from '@apollo/client';
import styles from '../styles/Home.module.css';
import DisplayError from './ErrorMessage';
import Render from './Rnd';
import { useRouter } from 'next/router';

export const QUERY_PROJEKT = gql`
  query QUERY_PROJEKT {
    projekt(id: "12", idType: DATABASE_ID) {
      title
      databaseId
      acf {
        fotos {
          id
          sourceUrl
          description
          mediaDetails {
            height
            width
          }
        }
      }
    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation UPDATE_PROJECT {
    updateProjekt(input: { id: "12", title: $title, slug: $title }) {
      clientMutationId
    }
  }
`;

export default function PlaceImages() {
  const router = useRouter();

  const { data, loading, error } = useQuery(QUERY_PROJEKT, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    <DisplayError error={error} />;
    return null;
  }

  return (
    <div>
      <h1 className='mx-auto text-center my-4'>
        Layout for {data.projekt.title}
      </h1>
      <div
        style={{
          width: '1000px',
          height: '4000px',
          margin: '35px auto',
          border: '1px solid black',
        }}
      >
        {data &&
          data.projekt.acf.fotos.map((image, index) => (
            <Render
              image={image}
              projectId={data.projekt.databaseId}
              key={index}
            />
          ))}
      </div>
    </div>
  );
}
