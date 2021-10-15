import 'jest-enzyme';
import React from "react";
import CheckboxFieldView from '@steroidsjs/bootstrap/form/CheckboxField/CheckboxFieldView';
import mountWithApp from '../../../../tests/mountWithApp';
import {ICheckboxFieldProps} from "./CheckboxField";

const CheckboxField = require('./CheckboxField').default;


describe('CheckboxField tests', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(CheckboxField, {view: CheckboxFieldView});
        expect(wrapper).not.toBeEmptyRender();
    });

    describe('Static props', () => {
       const props: ICheckboxFieldProps = {
           label: 'Checkbox',
           className: 'test',
           required: true,
           errors: ['Error text'],
           disabled: true,
       };

       const wrapper = mountWithApp(CheckboxField, {...props, view: CheckboxFieldView});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('CheckboxField')).toHaveProp(props);
        });
        it('should render label', () => {
            expect(wrapper.find('.CheckboxFieldView__label')).toHaveText(props.label);
        });

        it('should have external className', () => {
            expect(wrapper.find('input')).toHaveClassName(props.className);
        });
        it('should be required', () => {
            expect(wrapper.find('input')).toHaveProp('required', props.required);
        });
        it('should be disabled', () => {
            expect(wrapper.find('input')).toBeDisabled();
        });
    });

    describe('Actions', () => {
        it('should checked after click', () => {
            const wrapper = mountWithApp(CheckboxField, {view: CheckboxFieldView});
            wrapper.find('input').simulate('change', {target: {checked: true} });
            expect(wrapper.find('input')).toHaveProp('checked', true);
        });
    });
});
