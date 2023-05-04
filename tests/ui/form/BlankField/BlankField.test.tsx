import '@testing-library/jest-dom';
import React from 'react';
import {render} from '../../../customRender';
import {JSXWrapper, getElementByClassName} from '../../../helpers';
import BlankField from '../../../../src/ui/form/BlankField';
import AutoCompleteField from '../../../../src/ui/form/AutoCompleteField';

describe('BlankField tests', () => {
    const items = [
        {
            id: '1',
            label: 'Moscow',
        },
        {
            id: '2',
            label: 'Krasnoyarsk',
        },
        {
            id: '3',
            label: 'Krasnodar',
        },
    ];

    const expectedAutoCompleteFieldClass = 'AutoCompleteFieldView';

    it('should have correct text', () => {
        const text = 'test-text';
        const {getByText} = render(JSXWrapper(BlankField, {text}));
        const testText = getByText('test-text');

        expect(testText).toBeInTheDocument();
    });

    it('should have correct children', () => {
        const children = <AutoCompleteField items={items} />;
        const {container} = render(JSXWrapper(BlankField, {children}));
        const testChildren = getElementByClassName(container, expectedAutoCompleteFieldClass);

        expect(testChildren).toBeInTheDocument();
    });

    it('should have correct value', () => {
        const value = 'test-value';
        const {getByText} = render(JSXWrapper(BlankField, {value}));
        const testValue = getByText('test-value');

        expect(testValue).toBeInTheDocument();
    });
});
