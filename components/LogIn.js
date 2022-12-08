import useForm from '../lib/useForm';
import { gql, useMutation } from '@apollo/client';
import DisplayError from './ErrorMessage';
import { useRouter } from 'next/router';
import { CURRENT_USER_QUERY } from './User';
import styled from 'styled-components';

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($username: String!, $password: String!) {
    login(input: { password: $password, username: $username }) {
      authToken
      refreshToken
      user {
        id
      }
    }
  }
`;

const StyledForm = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    margin-bottom: 100px;

    input {
      margin-bottom: 1em;
      width: 250px;
      border: 1px solid black;
      height: 2.5em;
    }

    button {
      background-color: white;
      border: 2px solid black;
      color: black;
      flex: 0 1 auto;

      &:hover {
        background-color: black;
        color: white;
      }
    }
  }
`;

export default function LogIn() {
  const router = useRouter();

  const { inputs, handleChange, resetForm } = useForm({
    username: '',
    password: '',
  });

  const [login, { data, error, loading }] = useMutation(LOGIN_MUTATION, {
    variables: inputs,
  });

  async function onSubmit(e) {
    e.preventDefault();

    const res = await login();
    localStorage.setItem('token', res.data.login.authToken);
    localStorage.setItem('refreshToken', res.data.login.refreshToken);
    localStorage.setItem('user', res.data.login.user.id);
    resetForm();

    if (res.data.login.authToken) {
      router.reload();
    }
  }

  if (error) return <p>error</p>;

  return (
    <StyledForm>
      <form onSubmit={onSubmit}>
        <label htmlFor='usernam'>Username</label>
        <input
          type='text'
          name='username'
          id='username'
          onChange={handleChange}
          value={inputs.username}
          className='p-1'
        ></input>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          id='password'
          onChange={handleChange}
          value={inputs.password}
          className='p-1'
        ></input>
        <button className='pt-2 pb-1 mt-3' type='submit'>
          anmelden
        </button>
        {error && <DisplayError error={error} />}
      </form>
    </StyledForm>
  );
}
