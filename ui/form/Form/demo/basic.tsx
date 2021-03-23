import * as React from 'react';
import Form from '../Form';
import FieldSet from '../../FieldSet';
import TextField from '../../TextField';
import InputField from '../../InputField';
// import DateField from '../../DateField';
// import DateTimeField from '../../DateTimeField';

export default () => (
    <>
        <Form
            formId='TestForm'
        >
            <FieldSet
                prefix='user'
                label="label"
                fields={[
                    {
                        component: 'InputField',
                        attribute: 'email',
                        label: 'Email',
                    },
                    {
                        component: 'TextField',
                        attribute: 'message',
                        label: 'Message',
                    },
                    // {
                    //     component: 'DateField',
                    //     attribute: 'date',
                    //     label: 'Date'
                    // },
                    // {
                    //     component: 'DateTimeField',
                    //     attribute: 'startTime',
                    //     label: 'Start time'
                    // },
                ]}
            />
        </Form>
    </>
);
