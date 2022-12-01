import styled from 'styled-components';

export const StyledHorizontalLayoutPattern = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  div {
    width: 100%;
    height: 1px;
    background-color: #9cfaff;

    &:first-child,
    &:last-child {
      opacity: 0;
    }
  }
`;

export default StyledHorizontalLayoutPattern;
