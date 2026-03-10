import '@testing-library/jest-dom';
import React from 'react';

import Empty from '../../../../src/ui/list/Empty/Empty';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('Empty tests', () => {
    const expectedEmptyClass = 'EmptyView';

    const props = {};

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(Empty, props));
        const empty = getElementByClassName(container, expectedEmptyClass);
        expect(empty).toBeInTheDocument();
    });
});
