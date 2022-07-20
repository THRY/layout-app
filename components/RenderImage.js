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

const UPDATE_MEDIA_ITEM = gql`
  mutation UPDATE_MEDIA_ITEM($id: ID!, $description: String!, $coords: String) {
    updateMediaItem(
      input: { id: $id, description: $description, coords: $coords }
    ) {
      clientMutationId
      mediaItem {
        description
      }
    }
  }
`;

export default function RenderImage({ image, projectId, setIsSaving }) {
  console.log(image);
  const [isChanging, setChange] = useState(false);

  let ratio = image.mediaDetails.height / image.mediaDetails.width;
  let imageCoords = null;
  let trimmedCoords = {};

  if (image.description && image.description !== '') {
    let trimmedCoords = jQuery(image.description).text();
    trimmedCoords = trimmedCoords.replace(/“|”|″/g, `"`);
    // achtung trimmed cords wird wieder gespeichert in media item description
    console.log(trimmedCoords);
    trimmedCoords = JSON.parse(trimmedCoords);
    imageCoords = trimmedCoords[projectId];
  }

  const [state, setState] = useState({
    width: imageCoords ? imageCoords.width : 200,
    height: imageCoords ? imageCoords.height : 200 * ratio,
    x: imageCoords ? imageCoords.x : 20,
    y: imageCoords ? imageCoords.y : 20,
  });

  const imageUrl =
    image.mimeType == 'video/mp4' ? '/video_placeholder.jpeg' : image.sourceUrl;

  const [updateMediaItem, { data, loading, error }] =
    useMutation(UPDATE_MEDIA_ITEM);

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
    console.log('update image');
    console.log(state);

    let coords = {
      ...trimmedCoords,
      [projectId]: {
        ...state,
      },
    };

    const res = await updateMediaItem({
      variables: {
        id: image.id,
        description: JSON.stringify(coords),
        coords: 'gugus',
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
