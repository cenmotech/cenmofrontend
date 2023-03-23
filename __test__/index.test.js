import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react'
import { AuthenticationProvider } from '../context/AuthenticationContext';

describe('Home', () => {
  it('renders navbar', () => {
    const mockUser = jest.fn();
    const mockAccessToken = jest.fn();
    const { getByTestId } = render(
      <AuthenticationProvider>
                <ChakraProvider>
                    <Home user={mockUser} accessToken={mockAccessToken}/>
                </ChakraProvider>
            </AuthenticationProvider>
      );
    const navbar = getByTestId('navbar');
    expect(navbar).toBeInTheDocument();
  });
});
