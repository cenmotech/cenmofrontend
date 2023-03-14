import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/navbar';

describe('NavBar', () => {
  test('renders Home, Chats, Baskets, Transactions, and Seller Portal', () => {
    render(<Navbar />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    const chatsLink = screen.getByRole('link', { name: /chats/i });
    const basketsLink = screen.getByRole('link', { name: /baskets/i });
    const transactionsLink = screen.getByRole('link', { name: /transactions/i });
    const sellerPortalLink = screen.getByRole('link', { name: /seller portal/i });

    expect(homeLink).toBeInTheDocument();
    expect(chatsLink).toBeInTheDocument();
    expect(basketsLink).toBeInTheDocument();
    expect(transactionsLink).toBeInTheDocument();
    expect(sellerPortalLink).toBeInTheDocument();
  });
});