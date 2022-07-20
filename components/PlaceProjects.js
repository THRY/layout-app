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
    return <h2>Loading...</h2>;
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
