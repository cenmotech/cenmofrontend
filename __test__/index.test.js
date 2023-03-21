import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';

describe('Home', () => {
  it('renders navbar', () => {
    const { getByTestId } = render(<Home/>);
    const navbar = getByTestId('navbar');
    expect(navbar).toBeInTheDocument();
  });
});
