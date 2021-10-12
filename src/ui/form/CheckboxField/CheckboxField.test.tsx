import 'jest-enzyme';
import React from 'react';
import CheckboxFieldView from '@steroidsjs/bootstrap/form/CheckboxField/CheckboxFieldView';
import mountWithApp from '../../../../tests/mountWithApp';
import CheckboxField from './CheckboxField';

describe('CheckboxField', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(CheckboxField, {view: CheckboxFieldView});
        expect(wrapper).not.toBeEmptyRender();
    });
});
