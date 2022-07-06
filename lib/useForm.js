import { useState, useEffect } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial)
    .map((value) =>
      value !== 'undefined' && typeof value !== 'object' ? value : ''
    )
    .join('');

  useEffect(() => {
    // runs when the things we are watching change
    console.log('rerun init');

    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    let { value, name, type } = e.target;

    if (type === 'number') {
      value = parseInt(value);
    }

    if (type === 'file') {
      [value] = e.target.files;
    }

    if (type === 'email') {
      value = value.trim();
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    console.log('clear form');
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, null])
    );
    setInputs(blankState);
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
