import * as React from 'react';

import { render, screen } from 'utils/test';

import { Navbar } from '..';

describe('Navbar component', () => {
  it('renders the brand link', () => {
    render(<Navbar authenticated={false} onSignOut={jest.fn()} />);
    expect(
      screen.getByRole('link', { name: 'Major Pool 2022' })
    ).toBeInTheDocument();
  });

  describe('when a user is not logged in', () => {
    it('renders a link to the Login page', () => {
      render(<Navbar authenticated={false} onSignOut={jest.fn()} />);
      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    });
  });

  describe('when a user is logged in', () => {
    it('does not render a link to the Login page', () => {
      render(<Navbar authenticated onSignOut={jest.fn()} />);
      expect(
        screen.queryByRole('link', { name: 'Login' })
      ).not.toBeInTheDocument();
    });
  });
});
