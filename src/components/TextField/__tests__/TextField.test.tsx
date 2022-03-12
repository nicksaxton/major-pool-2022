import * as React from 'react';

import { render, screen } from 'utils/test';

import { TextField } from '..';

describe('TextField component', () => {
  it('renders a textbox with the provided label', () => {
    render(<TextField label="Foo" name="foo" />);
    expect(screen.getByRole('textbox', { name: 'Foo' })).toBeInTheDocument();
  });
});
