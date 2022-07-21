import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Rnd } from 'react-rnd';
import jQuery from 'jquery';
import styled from 'styled-components';

const style = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  border: '0',
  background: 'transparent',
  zIndex: 2,
  backgroundSize: 'cover',
  backgroundColor: 'transparent',
  paddingLeft: '20px',
  paddingRight: '20px',
  fontSize: '30px',
};

const UPDATE_LEADPOS_MUTATION = gql`
  mutation UPDATE_LEADPOS_MUTATION($id: ID!, $leadpos: String!) {
    updateProjekt(input: { id: $id, leadpos: $leadpos }) {
      clientMutationId
    }
  }
`;

const StyledLead = styled.h2`
  font-family: 'BoogyBrut', serif;
  font-size: 42px;
  line-height: 1.5em;
`;

export default function RenderLead({ lead, leadpos, projectId, setIsSaving }) {
  const [isChanging, setChange] = useState(false);

  let leadCoords = null;

  console.log(lead);

  if (lead && leadpos) {
    leadCoords = JSON.parse(leadpos);
  }

  const [state, setState] = useState({
    width: '1000px',
    height: '100px',
    x: leadCoords ? leadCoords.x : 20,
    y: leadCoords ? leadCoords.y : 20,
  });

  const [updateProjekt, { data, loading, error }] = useMutation(
    UPDATE_LEADPOS_MUTATION
  );

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
      updateLeadPos();
    }
  }, [isChanging]);

  useEffect(() => {
    setIsSaving(loading);
  }, [loading, error]);

  const updateLeadPos = async function () {
    const res = await updateProjekt({
      variables: {
        id: projectId,
        leadpos: JSON.stringify(state),
      },
    });
  };

  return (
    <Rnd
      style={{ ...style }}
      size={{ width: state.width, height: state.height }}
      position={{ x: state.x, y: state.y }}
      minWidth={200}
      maxWidth={'100%'}
      bounds={'parent'}
      // dragGrid={[10, 10]}
      onDrag={(e, d) => {
        setChange(true);
      }}
      onDragStop={(e, d) => {
        setState((state) => ({ ...state, x: d.x, y: d.y }));
        setChange(false);
      }}
      lockAspectRatio={true}
      enableResizing={false}
    >
      <StyledLead>{lead}</StyledLead>
    </Rnd>
  );
}
