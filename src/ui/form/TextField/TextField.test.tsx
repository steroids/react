import 'jest-enzyme';
import React from 'react';
import TextFieldView from '@steroidsjs/bootstrap/form/TextField/TextFieldView';
import TextField from "./TextField";
import mountWithApp from '../../../../tests/mountWithApp';

describe('TextField tests', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(TextField, {view: TextFieldView});
        expect(wrapper).not.toBeEmptyRender();
    });

    describe('Static props', () => {
        const props = {
            disabled: true,
            required: true,
            className: 'test',
            placeholder: 'test',
            errors: ['Error text']
        };

        const wrapper = mountWithApp(TextField, {...props, view: TextFieldView});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('TextField')).toHaveProp(props);
        });

        it('should have right placeholder', () => {
            expect(wrapper.find('textarea')).toHaveProp('placeholder', props.placeholder);
        });
        it('should have right external className', () => {
            expect(wrapper.find('textarea')).toHaveClassName(props.className);
        });
        it('should be disabled', () => {
            expect(wrapper.find('textarea')).toBeDisabled();
        });
    });

    describe('Actions', () => {
        it('should value change', () => {
            const wrapper = mountWithApp(TextField, {view: TextFieldView});
            wrapper.find('textarea').simulate('change', {target: {value: 'test'} });
            expect(wrapper.find('textarea')).toHaveProp('value', 'test');
        });
        it('should submit on enter', () => {
            const wrapper = mountWithApp(TextField, {view: TextFieldView});
            wrapper.find('textarea').simulate('keypress', {key: 'Enter'});
            // expect(wrapper.find('textarea')).toHaveProp(props.submitOnEnter);
        });
    })
});
