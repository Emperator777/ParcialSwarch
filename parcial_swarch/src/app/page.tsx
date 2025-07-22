'use client';

import { useReducer, FormEvent } from 'react';

type FormState = {
  id_user: string;
  monto: string;
  isLoading: boolean;
  error: string | null;
  success: boolean;
};

// Definimos las acciones posibles para el reducer
type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESET_FORM' };

// Estado inicial
const initialState: FormState = {
  id_user: '',
  monto: '',
  isLoading: false,
  error: null,
  success: false,
};

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'SUBMIT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
      };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        success: true,
        id_user: '',
        monto: '',
      };
    case 'SUBMIT_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

export default function AddMoneyForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validación simple
    if (!state.id_user || !state.monto) {
      dispatch({ type: 'SUBMIT_ERROR', error: 'Todos los campos son obligatorios' });
      return;
    }

    if (isNaN(Number(state.monto)) || Number(state.monto) <= 0) {
      dispatch({ type: 'SUBMIT_ERROR', error: 'La cantidad debe ser un número positivo' });
      return;
    }

    try {
      dispatch({ type: 'SUBMIT_START' });

      // Aquí harías la llamada a tu API
      console.dir(state);
      const response = await fetch('/api/add-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_user: state.id_user,
          monto: parseFloat(state.monto),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar los datos');
      }

      dispatch({ type: 'SUBMIT_SUCCESS' });
    } catch (error) {
      dispatch({
        type: 'SUBMIT_ERROR',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  return (
    <div className='flex items-center justify-center min-w-full min-h-[100vh] p-5 bg-[#333333]'>
    <div className="w-[35%] mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Añadir dinero a cuenta</h2>

      {state.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          ¡Dinero añadido correctamente!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="id_user" className="block text-sm font-medium text-gray-700">
            ID de Usuario
          </label>
          <input
            type="text"
            id="id_user"
            name="id_user"
            value={state.id_user}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={state.isLoading}
          />
        </div>

        <div>
          <label htmlFor="monto" className="block text-sm font-medium text-gray-700">
            Cantidad a añadir
          </label>
          <input
            type="text"
            id="monto"
            name="monto"
            value={state.monto}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={state.isLoading}
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={state.isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? 'Enviando...' : 'Enviar'}
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: 'RESET_FORM' })}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
