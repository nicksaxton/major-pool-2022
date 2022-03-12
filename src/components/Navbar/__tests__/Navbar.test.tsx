import * as React from 'react';

import { render, screen } from 'utils/test';

import { Navbar } from '..';

describe('Navbar component', () => {
  it('renders the brand link', () => {
    render(<Navbar />);
    expect(
      screen.getByRole('link', { name: 'Major Pool 2022' })
    ).toBeInTheDocument();
  });

  it('renders a link to the Login page', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });
});
