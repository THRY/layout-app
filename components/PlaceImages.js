import { useQuery, gql } from '@apollo/client';
import styles from '../styles/Home.module.css';
import DisplayError from './ErrorMessage';
import { useRouter } from 'next/router';
import { useState } from 'react';
import RenderImage from './RenderImage';
import RenderLead from './RenderLead';

export const QUERY_PROJEKT = gql`
  query QUERY_PROJEKT($id: ID!) {
    projekt(id: $id, idType: DATABASE_ID) {
      title
      databaseId
      acf {
        lead
        leadpos
        fotos {
          id
          sourceUrl
          description
          mimeType
          mediaDetails {
            height
            width
          }
          title(format: RENDERED)
        }
      }
    }
  }
`;

// const UPDATE_PROJECT = gql`
//   mutation UPDATE_PROJECT(id: Int!) {
//     updateProjekt(input: { id: $id, title: $title, slug: $title }) {
//       clientMutationId
//     }
//   }
// `;

export default function PlaceImages({ projectId }) {
  console.log(projectId);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { data, loading, error } = useQuery(QUERY_PROJEKT, {
    variables: {
      id: projectId,
    },
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
      <h1
        className='text-center'
        style={{
          width: '1000px',
          margin: '35px',
        }}
      >
        Layout for {data.projekt.title}
      </h1>
      <p
        style={{
          width: '1000px',
          margin: '0 35px',
        }}
        className='text-center'
      >
        {isSaving ? 'updating...' : 'saved!'}
      </p>
      <div
        style={{
          width: '1000px',
          height: '4000px',
          margin: '35px',
          outline: '3px solid lightgrey',
        }}
      >
        {data &&
          data.projekt.acf.fotos.map((image, index) => (
            <RenderImage
              image={image}
              setIsSaving={setIsSaving}
              projectId={data.projekt.databaseId}
              key={index}
            />
          ))}
        {data.projekt.acf.lead && (
          <RenderLead
            projectId={data.projekt.databaseId}
            setIsSaving={setIsSaving}
            lead={data.projekt.acf.lead}
            leadpos={data.projekt.acf.leadpos}
          />
        )}
      </div>
    </div>
  );
}
