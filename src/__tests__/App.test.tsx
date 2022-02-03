import { render, screen } from '@testing-library/react';

import App from '../App';

test('App renders with correct title', () => {
  render(<App />);
  const appElement = screen.getByTestId('app');
  const title = screen.getByText('Posts Table');

  expect(appElement).toBeInTheDocument();
  expect(title).toBeInTheDocument();
});
