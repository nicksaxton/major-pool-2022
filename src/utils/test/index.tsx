import * as React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Formik } from 'formik';

function render(node: React.ReactNode) {
  rtlRender(
    <BrowserRouter>
      <Formik initialValues={{}} onSubmit={() => {}}>
        {node}
      </Formik>
    </BrowserRouter>
  );
}

export { render, screen };
