import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the Thirty heading', () => {
    render(<App />);
    expect(screen.getByText('Thirty')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<App />);
    expect(screen.getByText(/track 30 plant foods/i)).toBeInTheDocument();
  });
});
