import { render, screen } from '@testing-library/react';
import Profile from '../pages/accounts/profile.js';
import { AuthenticationProvider } from '../context/AuthenticationContext.js';
import { ChakraProvider } from '@chakra-ui/react';

describe('Profile component', () => {
  test('renders heading with text "Profile"', () => {
    render(
        <AuthenticationProvider>
                <ChakraProvider>
                    <Profile/>
                </ChakraProvider>
            </AuthenticationProvider>
    );
    const headingElement = screen.getByText(/Profile/i);
    expect(headingElement);
  });

  test('renders input fields with placeholder text', () => {
    render(<AuthenticationProvider>
        <ChakraProvider>
            <Profile/>
        </ChakraProvider>
    </AuthenticationProvider>);
    const fullNameInputElement = screen.getByPlaceholderText(/Tim Timberlake/i);
    expect(fullNameInputElement);

    const emailInputElement = screen.getByPlaceholderText(/tim.timberlake@gmail.com/i);
    expect(emailInputElement);

    const phoneNumberInputElement = screen.getByPlaceholderText(/0851xxx/i);
    expect(phoneNumberInputElement);

    const streetInputElement = screen.getByPlaceholderText(/Jl. Kemayoran Baru Blok 5D/i);
    expect(streetInputElement);

    const provinceInputElement = screen.getByPlaceholderText(/Jawa Barat/i);
    expect(provinceInputElement);

    const cityInputElement = screen.getByPlaceholderText(/DKI Jakarta/i);
    expect(cityInputElement);

    const postalCodeInputElement = screen.getByPlaceholderText(/16810/i);
    expect(postalCodeInputElement);
  });

  test('renders "Verify Your ID" link', () => {
    render(<AuthenticationProvider>
        <ChakraProvider>
            <Profile/>
        </ChakraProvider>
    </AuthenticationProvider>);
    const verifyLinkElement = screen.getByText(/Verify Your ID/i);
    expect(verifyLinkElement);
  });

  test('renders "Tambah Alamat" button', () => {
    render(<AuthenticationProvider>
        <ChakraProvider>
            <Profile/>
        </ChakraProvider>
    </AuthenticationProvider>);
    const addAddressButtonElement = screen.getByText(/Tambah Alamat/i);
    expect(addAddressButtonElement);
  });

  test('renders "Update" button', () => {
    render(<AuthenticationProvider>
        <ChakraProvider>
            <Profile/>
        </ChakraProvider>
    </AuthenticationProvider>);
    const updateButtonElement = screen.getByText(/Update/i);
    expect(updateButtonElement);
  });
});
