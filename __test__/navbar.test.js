import { render, screen } from '@testing-library/react';
import Navbar from '../components/navbar';

describe('Navbar component', () => {
  test('renders navbar', () => {
    render(<Navbar />);
    const navbarElement = screen.getByTestId('navbar');
    expect(navbarElement);
  });

  test('renders Home button', () => {
    render(<Navbar />);
    const homeButton = screen.getByText('Home');
    expect(homeButton);
  });

  test('renders Chats button', () => {
    render(<Navbar />);
    const chatsButton = screen.getByText('Chats');
    expect(chatsButton);
  });

  test('renders Baskets button', () => {
    render(<Navbar />);
    const basketsButton = screen.getByText('Baskets');
    expect(basketsButton);
  });

  test('renders Transaction button', () => {
    render(<Navbar />);
    const transactionButton = screen.getByText('Transaction');
    expect(transactionButton);
  });

  test('renders Seller Portal button', () => {
    render(<Navbar />);
    const sellerPortalButton = screen.getByText('Seller Portal');
    expect(sellerPortalButton);
  
  })
});