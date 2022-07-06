import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Rnd } from 'react-rnd';
import jQuery from 'jquery';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: 'transparent',
  zIndex: 2,
  backgroundSize: 'cover',
};

const UPDATE_MEDIA_ITEM = gql`
  mutation UPDATE_MEDIA_ITEM($id: ID!, $description: String!) {
    updateMediaItem(input: { id: $id, description: $description }) {
      clientMutationId
      mediaItem {
        description
      }
    }
  }
`;

export default function Render({ image, projectId }) {
  console.log(projectId);
  const [isChanging, setChange] = useState(false);

  let ratio = image.mediaDetails.height / image.mediaDetails.width;
  let imageCoords = null;

  if (image.description && image.description !== '') {
    let trimmedCoords = jQuery(image.description).text();
    trimmedCoords = trimmedCoords.replace(/“|”/g, `"`);
    imageCoords = JSON.parse(trimmedCoords);
    imageCoords = imageCoords[projectId];
  }

  const [state, setState] = useState({
    width: imageCoords ? imageCoords.width : 200,
    height: imageCoords ? imageCoords.height : 200 * ratio,
    x: imageCoords ? imageCoords.x : 20,
    y: imageCoords ? imageCoords.y : 20,
  });

  const [updateMediaItem, { data, loading, error }] =
    useMutation(UPDATE_MEDIA_ITEM);

  useEffect(() => {
    if (isChanging == false) {
      updateImage();
    }
  }, [isChanging]);

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
      },
    });
  };

  return (
    <div>
      <Rnd
        style={{ ...style, backgroundImage: `url(${image.sourceUrl})` }}
        size={{ width: state.width, height: state.height }}
        position={{ x: state.x, y: state.y }}
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
      ></Rnd>
    </div>
  );
}
