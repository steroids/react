import * as React from 'react';
import {render} from '../../../tests/renderWithApp';
import TestComponent from './testComponent';

describe('TestComponent rtl example', () => {
    test('usage', () => {
        const {getByText} = render(<TestComponent />);

        const testElement = getByText('TestComponent');
        console.log(testElement);
    });
});
