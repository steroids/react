import '@testing-library/jest-dom';
import React from 'react';

import FlexGridMockView from './FlexGridMockView';
import FlexGrid, {IFlexGridProps} from '../../../../src/ui/list/FlexGrid/FlexGrid';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('FlexGrid tests', () => {
    const expectedFlexGridClass = 'FlexGridView';

    const items = [
        {
            content: <div>col-12</div>,
            col: 12,
        },
        {
            content: <div>col-6</div>,
            col: 6,
        },
        {
            content: <div>col-6</div>,
            col: 6,
        },
    ];

    const props = {
        items,
        className: 'test-flex-grid',
        view: FlexGridMockView,
        direction: 'column',
        justify: 'center',
        align: 'flex-end',
        wrap: true,
    } as IFlexGridProps;

    const wrapper = JSXWrapper(FlexGrid, props);

    it('should be in the document', () => {
        const {container} = render(wrapper);

        const flexGrid = getElementByClassName(container, expectedFlexGridClass);
        expect(flexGrid).toBeInTheDocument();
    });

    it('should have correct classes', () => {
        const {container} = render(wrapper);
        const flexGrid = getElementByClassName(container, expectedFlexGridClass);

        expect(flexGrid).toHaveClass(props.className);
        expect(flexGrid).toHaveClass(`${expectedFlexGridClass}_direction_${props.direction}`);
        expect(flexGrid).toHaveClass(`${expectedFlexGridClass}_justify_${props.justify}`);
        expect(flexGrid).toHaveClass(`${expectedFlexGridClass}_align_${props.align}`);
        expect(flexGrid).toHaveClass(`${expectedFlexGridClass}_wrap`);
    });
});
