import useForm from '../lib/useForm';
import { gql, useMutation } from '@apollo/client';
import DisplayError from './ErrorMessage';
import { useRouter } from 'next/router';

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($username: String!, $password: String!) {
    login(input: { password: $password, username: $username }) {
      authToken
      refreshToken
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
    console.log(e);
    console.log(inputs);

    const res = await login();
    console.log(res);
    localStorage.setItem('token', res.data.login.authToken);
    localStorage.setItem('refreshToken', res.data.login.refreshToken);
    resetForm();

    if (res.data.login.authToken) {
      router.push('/');
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <p>Username</p>
        <input
          type='text'
          name='username'
          onChange={handleChange}
          value={inputs.username}
        ></input>
        <p>Password</p>
        <input
          type='text'
          name='password'
          onChange={handleChange}
          value={inputs.password}
        ></input>
        <button type='submit'>Submit</button>
        {error && <DisplayError error={error} />}
      </form>
    </div>
  );
}
