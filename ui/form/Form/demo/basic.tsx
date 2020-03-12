import * as React from 'react';
import Form from '../Form';
import FieldSet from '../../FieldSet';
import TextField from '../../TextField';
import InputField from '../../InputField';
import DateField from '../../DateField';
import DateTimeField from '../../DateTimeField';

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <Form
                    formId='TestForm'
                >
                    <FieldSet prefix='user'>
                        <InputField
                            label='Email'
                            attribute='email'
                        />
                        <TextField
                            label='Message'
                            attribute='message'
                            submitOnEnter
                        />
                        <DateField
                            label='Date'
                            attribute='date'
                        />
                        <DateTimeField
                            label='Start time'
                            attribute='startTime'
                        />
                    </FieldSet>
                </Form>
            </>
        );
    }
}
