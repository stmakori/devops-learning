import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the page header', () => {
  render(<App />);
  expect(screen.getByText(/react with nodejs/i)).toBeInTheDocument();
});
