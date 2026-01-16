import '@testing-library/jest-dom';
import React from 'react';

import BlankField from '../../../../src/ui/form/BlankField';
import InputField from '../../../../src/ui/form/InputField';
import {JSXWrapper, getElementByClassName, render} from '../../../helpers';

describe('BlankField tests', () => {
    it('should have correct text', () => {
        const text = 'test-text';
        const {getByText} = render(JSXWrapper(BlankField, {text}));
        const testText = getByText('test-text');

        expect(testText).toBeInTheDocument();
    });

    it('should have correct children', () => {
        const expectedChildrenClass = 'InputFieldView';
        const children = <InputField />;
        const {container} = render(JSXWrapper(BlankField, {children}));
        const testChildren = getElementByClassName(container, expectedChildrenClass);

        expect(testChildren).toBeInTheDocument();
    });

    it('should have correct value', () => {
        const value = 'test-value';
        const {getByText} = render(JSXWrapper(BlankField, {value}));
        const testValue = getByText('test-value');

        expect(testValue).toBeInTheDocument();
    });
});
