import * as React from 'react';
import Form from '../Form';
import DateField from '../../DateField';
import DateTimeField from '../../DateTimeField';
import TextField from '../../TextField';
import InputField from '../../InputField';

/**
 * Basic
 * @order 1
 * @col 12
 */
export default () => (
    <>
        <Form
            formId='TestForm'
            useRedux
            syncWithAddressBar
            autoFocus
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
