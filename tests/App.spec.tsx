import React from 'react';
import { describe, it, vi, expect, beforeAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, fireEvent, act, screen } from '@testing-library/react';

import App from '../src/App';

describe('Componente Inicio', () => {
  it('Deve renderizar formulário de acesso', () => {
    const { getByRole, getByText, getByPlaceholderText } = render(<App />)

    const logomarca = getByRole('heading')
    const inputLabel = getByText('Código do usuário')
    const input = getByPlaceholderText('Digitar código')
    const submitButton = getByText('Confirmar')

    expect(logomarca).toBeInTheDocument();
    expect(inputLabel).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  })

  it('Input deve mostrar extamente o que foi digitado', () => {
    const { getByPlaceholderText } = render(<App />)
    const input = getByPlaceholderText('Digitar código')

    act(() => {
      fireEvent.input(input, { target: { value: '123' } })
    })

    expect(input).toHaveValue('123')
  })

  it('Deve mostrar mensagem carregando após clicar no botão confirmar', async () => {
    const { getByPlaceholderText, getByRole } = render(<App />)
    const input = getByPlaceholderText('Digitar código')
    const button = getByRole('button')

    act(() => {
      fireEvent.input(input, { target: { value: '123' } })
      userEvent.click(button);
    })

    const loadingButton = await screen.findByText('Carregando...')

	  expect(loadingButton).toBeInTheDocument()
  })
})
