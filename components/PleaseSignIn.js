import LogIn from './LogIn';
import { useUser } from './User';

export default function PleaseSignIn({ children }) {
  const token = localStorage.getItem('token');
  console.log(token);

  if (!token) return <LogIn />;

  return children;
}
