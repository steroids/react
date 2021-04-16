import * as React from 'react';

import Form from '../../Form';
import InputField from '../../InputField';
import FieldSet from '../FieldSet';
import DropDownField from '../../DropDownField';

export default () => (
    <>
        <Form formId='FieldListForm'>
            <FieldSet
                fields={[
                    {
                        attribute: 'name',
                        component: InputField,
                        label: 'Name',
                    },
                    {
                        attribute: 'country',
                        component: DropDownField,
                        label: 'Country',
                        items: ['Novosibirsk', 'Krasnoyarsk', 'Tomsk'],
                    },
                ]}
                label='Your personal data'
            />
        </Form>
    </>
);
