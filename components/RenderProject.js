import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Rnd } from 'react-rnd';
import jQuery from 'jquery';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '0',
  background: 'transparent',
  zIndex: 2,
  backgroundSize: 'cover',

  '&:hover': {
    opacity: '0.6',
  },
};

const UPDATE_PROJECT = gql`
  mutation UPDATE_PROJECT($id: ID!, $storycoords: String!) {
    updateProjekt(input: { id: $id, homecoords: $storycoords }) {
      clientMutationId
    }
  }
`;

export default function RenderProject({
  image,
  projectId,
  setIsSaving,
  homecoords,
}) {
  console.log(image);
  const [isChanging, setChange] = useState(false);

  let ratio = image.mediaDetails.height / image.mediaDetails.width;
  let projectCoords = null;

  if (homecoords && homecoords !== '') {
    projectCoords = JSON.parse(homecoords);
  }

  const [state, setState] = useState({
    width: projectCoords ? projectCoords.width : 200,
    height: projectCoords ? projectCoords.height : 200 * ratio,
    x: projectCoords ? projectCoords.x : 20,
    y: projectCoords ? projectCoords.y : 20,
  });

  const imageUrl =
    image.mimeType == 'video/mp4' ? '/video_placeholder.jpeg' : image.sourceUrl;

  const [updateProjekt, { data, loading, error }] = useMutation(UPDATE_PROJECT);

  // prevent updating image on initial render
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
  });

  useEffect(() => {
    if (isChanging == false && firstUpdate.current == false) {
      updateImage();
    }
  }, [isChanging]);

  useEffect(() => {
    setIsSaving(loading);
  }, [loading, error]);

  const updateImage = async function () {
    console.log('update projekt');

    const res = await updateProjekt({
      variables: {
        id: projectId,
        storycoords: JSON.stringify(state),
      },
    });
  };

  return (
    <Rnd
      style={{
        ...style,
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: '50% 50%',
      }}
      size={{ width: state.width, height: state.height }}
      position={{ x: state.x, y: state.y }}
      minWidth={200}
      maxWidth={'100%'}
      bounds={'parent'}
      // dragGrid={[20, 20]}
      onDrag={(e, d) => {
        setChange(true);
      }}
      onDragStop={(e, d) => {
        setState((state) => ({ ...state, x: d.x, y: d.y }));
        setChange(false);
      }}
      lockAspectRatio={true}
      onResize={() => {
        setChange(true);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setState((state) => ({
          ...position,
          width: `${ref.style.width}`,
          height: `${ref.style.height}`,
          // left: parseInt(ref.style.width.replace('px', '')) / 1000,
        }));
        setChange(false);
      }}
    >
      {image.mimeType == 'video/mp4' && <p className='m-0'>{image.title}</p>}
    </Rnd>
  );
}
