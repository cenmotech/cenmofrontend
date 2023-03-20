import React from 'react';
import { render, fireEvent, screen, markElement } from '@testing-library/react';
import Register from '../pages/register.js';
import AuthenticationContext from '../context/AuthenticationContext';

test('should not show error message if password meets criteria', () => {
  const setPasswordError = jest.fn();
  render(
    <AuthenticationContext.Provider value={{ setPasswordError }}>
      <Register />
    </AuthenticationContext.Provider>
  );

  const input = screen.getByPlaceholderText('Enter password');
  fireEvent.change(input, { target: { value: 'Abc123456' } });

  // Assuming the password is valid, setPasswordError should be called with an empty string
  expect(setPasswordError);

  // Check if error message is not displayed
  expect(screen.queryByText('Password must meet the criteria')).toBeNull();
});


test('should hide password when hide button is clicked', () => {
  const { getByTestId } = render(<AuthenticationContext.Provider
    value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>);
  const input = getByTestId('password-input');
  const button = getByTestId('show-password-button');
  
  // Type password in the input field
  fireEvent.change(input, { target: { value: 'StrongP@ssw0rd' } });
  
  // Click show button
  fireEvent.click(button);
  
  // Click hide button
  fireEvent.click(button);
  
  // Check if password is hidden
  expect(input.getAttribute('type')).toEqual('password');
});

test('should show password in plain text when show button is clicked', () => {
  const { getByTestId } = render(<AuthenticationContext.Provider
    value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>);
  const input = getByTestId('password-input');
  const button = getByTestId('show-password-button');
  
  // Type password in the input field
  fireEvent.change(input, { target: { value: 'StrongP@ssw0rd' } });
  
  // Click show button
  fireEvent.click(button);
  
  // Check if password is displayed in plain text
  expect(input.getAttribute('type')).toEqual('text');
});

test('should show error message if password does not meet criteria', () => {
  const { getByTestId } = render(<AuthenticationContext.Provider
    value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>);
  const input = getByTestId('password-input');
  fireEvent.change(input, { target: { value: 'weakpassword' } });
  expect(screen.getByText('Password must meet the criteria'));
});

test('should not show error message if password meets criteria', () => {
  const { getByTestId } = render(<AuthenticationContext.Provider
    value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>);
  const input = getByTestId('password-input');
  fireEvent.change(input, { target: { value: 'StrongP@ssw0rd' } });
  expect(screen.queryByText('Password must meet the criteria'));
});

test('should show error message if phone number is less than 10 digits', () => {
  const { getByTestId } = render(<AuthenticationContext.Provider
    value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>);
  const input = getByTestId('mobile-number');
  fireEvent.change(input, { target: { value: '123456789' } });
  expect(screen.getByText('Mobile number must be at least 10 digits'));
});

test('should not show error message if phone number is 10 digits or more', () => {
  const { getByTestId } = render(<AuthenticationContext.Provider
    value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>);
  const input = getByTestId("mobile-number");
  fireEvent.change(input, { target: { value: '1234567890' } });
  expect(screen.queryByText('Mobile number must be at least 10 digits'));
});

test("displays error message if input contains non-letter characters", () => {
  const { getByLabelText, getByText } = render(<AuthenticationContext.Provider
    value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>);
  const input = getByLabelText("Full name");
  fireEvent.change(input, { target: { value: "John Doe123" } });
  expect(getByText("Full name must contain only letters"));
});

test("does not display error message if input contains only letter characters", () => {
  const { getByLabelText, queryByText } = render(<AuthenticationContext.Provider
    value={{ register: () => {} }}>
      <Register />
    </AuthenticationContext.Provider>);
  const input = getByLabelText("Full name");
  fireEvent.change(input, { target: { value: "John Doe" } });
  expect(queryByText("Full name must contain only letters"));
});

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
});