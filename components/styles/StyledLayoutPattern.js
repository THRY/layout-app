import styled from 'styled-components';

export const StyledLayoutPattern = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: ${(props) => (props.nopadding ? '0' : '0 20px')};

  div {
    flex: 0 1 60px;
    background-color: #cffdff;
  }
`;

export default StyledLayoutPattern;
