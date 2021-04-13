import React from 'react';
import InputFieldView from '@steroidsjs/bootstrap/form/InputField/InputFieldView';
import InputField from './InputField';
import mountWithApp from '../../../tests/mountWithApp';

describe('InputField tests', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(InputField, {view: InputFieldView});
        expect(wrapper).not.toBeEmptyRender();
    });

    describe('Static props', () => {
        const props = {
            type: 'password',
            disabled: true,
            required: true,
            className: 'test',
            placeholder: 'test',
            //errors: [{foo: 'bar'}], TODO: add test 'should have right is-invalid modifier'
            style: {width: '120px'},
        };

        const wrapper = mountWithApp(InputField, {...props, view: InputFieldView});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('InputField')).toHaveProp(props);
        });
        it('should have right type', () => {
            expect(wrapper.find('input')).toHaveProp('type', props.type);
        });
        it('should have right placeholder', () => {
            expect(wrapper.find('input')).toHaveProp('placeholder', props.placeholder);
        });
        it('should have right external style', () => {
            expect(wrapper.find('InputField')).toHaveProp('style', props.style);
        });
        it('should have right external className', () => {
            expect(wrapper.find('InputField')).toHaveClassName(props.className);
        });
        it('should be disabled ', () => {
            expect(wrapper.find('input')).toBeDisabled();
        });
    });

    describe('Conditional props', () => {
        it('should render empty with type "hidden"', () => {
            const wrapper = mountWithApp(InputField, {type: 'hidden', view: InputFieldView});
            expect(wrapper).toBeEmptyRender();
        });
    });

    describe('Actions', () => {
        it('should value change', () => {
            const wrapper = mountWithApp(InputField, {view: InputFieldView});
            wrapper.find('input').simulate('change', { target: { value: 'test' } });
            expect(wrapper.find('input')).toHaveProp('value', 'test');
        });
    });
});
