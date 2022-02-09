import * as React from 'react';
import {DropDownField} from '../../../form';
import Form from '../Form';
import DateField from '../../DateField';
import InputField from '../../InputField';

/**
 * Обычный пример использования с Form в одну строку с использованием layout='inline'.
 * @order 3
 * @col 12
 */

export default () => (
    <>
        <Form
            formId='TestForm'
            useRedux
            syncWithAddressBar
            autoFocus
            layout='inline'
            size='large'
            fields={[
                {
                    component: DropDownField,
                    attribute: 'email',
                },
                {
                    component: InputField,
                    attribute: 'message',
                },
                {
                    component: DateField,
                    attribute: 'date',
                },
            ]}
            submitLabel='Submit'
            validators={[['Email', 'required']]}
        />
    </>
);
