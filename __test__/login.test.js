import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react'
import { AuthenticationProvider } from '../context/AuthenticationContext';
import Login from '../pages/login';
import '@testing-library/jest-dom';
describe('Login', () => {
    it('renders a login page', () => {
        render(
            <AuthenticationProvider>
                <ChakraProvider>
                    <Login />
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

        
    })
});