import * as React from 'react';
import Form from '../Form';
import DateField from '../../DateField';
import DateTimeField from '../../DateTimeField';
import TextField from '../../TextField';
import InputField from '../../InputField';

/**
 * Обычный пример включения рамок у компонента Form.
 * @order 4
 * @col 12
 */

export default () => (
    <>
        <Form
            isBordered
            formId='TestForm'
            useRedux
            syncWithAddressBar
            autoFocus
            layout='default'
            size='large'
            fields={[
                {
                    component: InputField,
                    attribute: 'email',
                    label: 'Email',
                },
                {
                    component: TextField,
                    attribute: 'message',
                    label: 'Message',
                },
                {
                    component: DateField,
                    attribute: 'date',
                    label: 'Date',
                },
                {
                    component: DateTimeField,
                    attribute: 'startTime',
                    label: 'Start time',
                },
            ]}
            submitLabel='Submit'
            validators={[['Email', 'required']]}
        />
    </>
);
