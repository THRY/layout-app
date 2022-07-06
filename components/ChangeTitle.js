import useForm from '../lib/useForm';
import { gql, useMutation } from '@apollo/client';
import { QUERY } from './PlaceImages';

const CHANGETITLE_MUTATION = gql`
  mutation CHANGETITLE_MUTATION($title: String!) {
    updateProjekt(input: { id: "12", title: $title, slug: $title }) {
      clientMutationId
    }
  }
`;

export default function ChangeTitle() {
  const { inputs, handleChange, resetForm } = useForm({
    title: '',
  });

  const [changeTitle, { data, loading, error }] = useMutation(
    CHANGETITLE_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: QUERY }],
    }
  );

  async function onSubmit(e) {
    e.preventDefault();
    console.log(e);
    console.log(inputs);

    const res = await changeTitle();
    console.log(res);
    resetForm();
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <p>New Title</p>
        <input
          type='text'
          name='title'
          onChange={handleChange}
          value={inputs.title}
        ></input>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}
