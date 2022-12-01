import { useQuery, gql } from '@apollo/client';
import styles from '../styles/Home.module.css';
import DisplayError from './ErrorMessage';
import { useRouter } from 'next/router';
import { useState } from 'react';
import RenderImage from './RenderImage';
import RenderLead from './RenderLead';
import RenderProject from './RenderProject';
import StyledLayoutContainer from './styles/StyledLayoutContainer';
import StyledLayoutPattern from './styles/StyledLayoutPattern';
import PlacingHeader from './PlacingHeader';
import { StyledLoader } from './PlaceImages';
import styled from 'styled-components';
import { StyledHorizontalLayoutPattern } from './styles/StyledHorizontalLayoutPattern';

export const QUERY_PAGE = gql`
  query QUERY_PAGE($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      title
      databaseId
      acf_home {
        storyselection {
          ... on Projekt {
            databaseId
            acf {
              homecoords
              featuredVideo {
                sourceUrl
                mimeType
                mediaDetails {
                  height
                  width
                }
                title(format: RENDERED)
              }
            }
            featuredImage {
              node {
                sourceUrl
                mimeType
                mediaDetails {
                  height
                  width
                }
              }
            }
          }
        }
      }
    }
  }
`;

const StyledLogo = styled.img`
  width: 285px;
  height: auto;
  position: absolute;
  top: 0;
  left: 40px;
`;

export default function PlaceProjects({ pageId, permalink }) {
  console.log(pageId);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { data, loading, error } = useQuery(QUERY_PAGE, {
    variables: {
      id: pageId,
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

  console.log(data);

  // return <p>hallo</p>;
  return (
    <div>
      <PlacingHeader
        loading={isSaving}
        title={data.page.title}
        permalink={permalink}
        linktext='Zur Seite'
      />
      <StyledLayoutContainer>
        <StyledLayoutPattern nopadding={true}>
          {Array.from(Array(10).keys()).map((item, index) => (
            <div key={index}></div>
          ))}
        </StyledLayoutPattern>
        <StyledHorizontalLayoutPattern>
          {Array.from(Array(70).keys()).map((item, index) => (
            <div key={index}></div>
          ))}
        </StyledHorizontalLayoutPattern>
        <StyledLogo src='/sj-logo.svg' />

        {data &&
          data.page.acf_home.storyselection.map((story, index) => {
            if (story.featuredImage || story.acf.featuredVideo) {
              let image = story.acf.featuredVideo
                ? story.acf.featuredVideo
                : story.featuredImage.node;

              return (
                <RenderProject
                  image={image}
                  setIsSaving={setIsSaving}
                  projectId={story.databaseId}
                  homecoords={story.acf.homecoords}
                  key={index}
                />
              );
            }
          })}
      </StyledLayoutContainer>
    </div>
  );
}
