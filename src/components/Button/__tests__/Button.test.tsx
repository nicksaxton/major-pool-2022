import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { Button } from '..';

describe('Button component', () => {
  it('renders a button element', () => {
    render(<Button>I am a button</Button>);
    expect(
      screen.getByRole('button', { name: 'I am a button' })
    ).toBeInTheDocument();
  });
});
