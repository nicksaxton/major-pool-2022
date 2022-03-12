import * as React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

function render(node: React.ReactNode) {
  rtlRender(<BrowserRouter>{node}</BrowserRouter>);
}

export { render, screen };
