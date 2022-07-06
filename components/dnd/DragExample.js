import { useCallback, useState } from 'react';
import { Container } from './Container.js';
import { CustomDragLayer } from './CustomDragLayer.js';
export const DragExample = () => {
  return (
    <div>
      <Container />
      <CustomDragLayer />
    </div>
  );
};
