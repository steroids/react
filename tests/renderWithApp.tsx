import React, {ReactElement} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, RenderOptions} from '@testing-library/react';
import useApplication from '../src/hooks/useApplication';

function AllTheProviders({children}: {children: React.ReactNode}) {
    const {renderApplication} = useApplication({});

    return renderApplication(children);
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options});

export {customRender as render};
