import {render, RenderOptions} from '@testing-library/react';
import React, {ReactElement} from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import MockApplication from '../mocks/mockApplication';

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {
    wrapper: MockApplication,
    ...options,
});

export {customRender as render};
