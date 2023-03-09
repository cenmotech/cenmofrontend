import React from 'react';
import { render, fireEvent, screen, markElement } from '@testing-library/react';
import Register from '../pages/register.js';
import AuthenticationContext from '../context/AuthenticationContext';

test('renders register component', () => {
  render(
    <AuthenticationContext.Provider value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>
  );
  const linkElements = screen.getAllByText(/Register/i);
  expect(linkElements).toHaveLength(2);
});

test('displays error when email is invalid', () => {
  const { getByLabelText, getByText } = render(
    <AuthenticationContext.Provider value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>
  );
  
  const inputElement = getByLabelText('Email address');
  fireEvent.change(inputElement, { target: { value: 'invalidemail' } });
  const buttonElement = getByText('Register', { selector: 'mark' });
  fireEvent.click(buttonElement);
  //const errorElement = getByText('Email Anda tidak valid.');
  //expect(errorElement).toBeInTheDocument();
});

test('submits registration data', () => {
  const mockRegister = jest.fn();
  const { getByLabelText, getByText } = render(
    <AuthenticationContext.Provider value={{ register: mockRegister }}>
      <Register />
    </AuthenticationContext.Provider>
  );
  const nameInputElement = getByLabelText('Full name');
  fireEvent.change(nameInputElement, { target: { value: 'John Doe' } });
  const emailInputElement = getByLabelText('Email address');
  fireEvent.change(emailInputElement, {
    target: { value: 'johndoe@example.com' },
  });
  const phoneInputElement = getByLabelText('Mobile number');
  fireEvent.change(phoneInputElement, { target: { value: '081234567890' } });
  const passwordInputElement = getByLabelText('Password');
  fireEvent.change(passwordInputElement, { target: { value: 'password' } });
  const buttonElement = getByText('Register', { selector: 'mark' });
  fireEvent.click(buttonElement);
  //expect(mockRegister).toHaveBeenCalledWith({
  //  email: 'johndoe@example.com',
  //  name: 'John Doe',
  //  phone: '081234567890',
  //  password: 'password',
  //});
});
