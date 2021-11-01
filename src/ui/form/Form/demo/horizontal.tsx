import * as React from 'react';
import Form from '../Form';
import DateField from '../../DateField';
import InputField from '../../InputField';

/**
 * Обычный пример использования с прокидыванием свойства layout='horizontal'.
 * @order 2
 * @col 12
 */

export default () => (
    <>
        <Form
            formId='TestForm'
            useRedux
            syncWithAddressBar
            autoFocus
            layout='horizontal'
            size='large'
            fields={[
                {
                    component: InputField,
                    attribute: 'email',
                    label: 'Email',
                },
                {
                    component: () => <InputField />,
                    attribute: 'message',
                    label: 'Message',
                },
                {
                    component: DateField,
                    attribute: 'date',
                    label: 'Date',
                },
            ]}
            submitLabel='Submit'
            validators={[['Email', 'required']]}
        />
    </>
);
