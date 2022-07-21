import styled from 'styled-components';

const StyledHeader = styled.header`
  margin: 35px;
  width: 1000px;
  display: flex;
  flex-direction: column;

  h1 {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      display: inline-block;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 40px;
        height: auto;

        &.loader {
          width: 50px;
        }
      }
    }
  }

  a {
    display: flex;
    align-items: center;
    color: black;

    &:hover {
      color: black;
      text-decoration: none;

      &::before {
        transform: translateX(5px);
      }
    }

    &::before {
      content: '';
      display: inline-block;
      width: 50px;
      height: 1em;
      background-image: url('/noun-arrow-long-right-4411421.svg');
      background-size: contain;
      background-repeat: no-repeat;
      transition: transform 0.25s ease-in-out;
    }
  }
`;

export default function PlacingHeader({ title, loading, permalink, linktext }) {
  return (
    <StyledHeader>
      <h1>
        Layout «{title}»{' '}
        <span>
          {' '}
          {loading ? (
            <img className='loader' src='/Dual Ring-1s-200px.gif' />
          ) : (
            <img src='noun-done-4762005.svg' />
          )}
        </span>
      </h1>
      <a href={permalink} target='_blank' rel='noreferrer'>
        {linktext ? linktext : 'zum Projekt'}
      </a>
    </StyledHeader>
  );
}
