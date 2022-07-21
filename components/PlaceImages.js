import { useQuery, gql } from '@apollo/client';
import styles from '../styles/Home.module.css';
import DisplayError from './ErrorMessage';
import { useRouter } from 'next/router';
import { useState } from 'react';
import RenderImage from './RenderImage';
import RenderLead from './RenderLead';
import styled from 'styled-components';
import StyledLayoutContainer from './styles/StyledLayoutContainer';
import StyledLayoutPattern from './styles/StyledLayoutPattern';
import PlacingHeader from './PlacingHeader';

export const QUERY_PROJEKT = gql`
  query QUERY_PROJEKT($id: ID!) {
    projekt(id: $id, idType: DATABASE_ID) {
      title
      databaseId
      acf {
        lead
        leadpos
        fotos {
          acf_media {
            coords
          }
          id
          guid
          databaseId
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

export const StyledLoader = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 50px;
    height: auto;
  }
`;

export default function PlaceImages({ projectId, permalink }) {
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
    return (
      <StyledLoader>
        <img src='Dual Ring-1s-200px.gif' />
      </StyledLoader>
    );
  }

  if (error) {
    console.error(error);
    <DisplayError error={error} />;
    return null;
  }

  return (
    <div>
      <PlacingHeader
        loading={isSaving}
        title={data.projekt.title}
        permalink={permalink}
      />

      <StyledLayoutContainer>
        <StyledLayoutPattern>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </StyledLayoutPattern>
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
      </StyledLayoutContainer>
    </div>
  );
}
