import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react'
import { AuthenticationProvider } from '../context/AuthenticationContext';
import Login from '../pages/login';
import '@testing-library/jest-dom';
describe('Login', () => {
    it('renders a login page', () => {
        const mockLogin = jest.fn();
        render(
            <AuthenticationProvider>
                <ChakraProvider>
                    <Login login={mockLogin}/>
                </ChakraProvider>
            </AuthenticationProvider>
        )
        
        const heading = screen.getByRole('heading', {
            name: /Welcome in Cenmo\!/i,
          })
      
        expect(heading).toBeInTheDocument()
        expect(screen.getByText('Central Marketplace Online')).toBeInTheDocument();
        expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
        
        // Click the submit button without filling out the form
        const submitButton = screen.getByText('Log In');
        fireEvent.click(submitButton);

        // Fill out email and password fields
        const emailInput = screen.getByLabelText('Email address');
        const passwordInput = screen.getByLabelText('Password');
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // const passwordInput = screen.getByPlaceholderText('Enter password');
        const toggleButton = screen.getByTestId('toggle-password');

        // Check that the password input starts as a password field
        expect(passwordInput.type).toBe('password');

        // Click the toggle button and check that the password input becomes a text field
        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe('text');

        // Click the toggle button again and check that the password input becomes a password field
        fireEvent.click(toggleButton);
        expect(passwordInput.type).toBe('password');
        
    })
});