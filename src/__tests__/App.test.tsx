import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders App with correct title', () => {
  render(<App />);
  const title = screen.getByText(/Posts Table/i);
  expect(title).toBeInTheDocument();
});
