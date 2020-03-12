import * as React from 'react';

import FieldList from '../FieldList';
import Form from '../../Form';
import InputField from '../../InputField';
import NumberField from '../../NumberField';

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <Form formId='FieldListForm'>
                    <FieldList
                        attribute='items'
                        label='Items'
                        items={[
                            {
                                label: 'Name',
                                attribute: 'name',
                                component: InputField,
                            },
                            {
                                label: 'Amount',
                                attribute: 'amount',
                                component: NumberField,
                            },
                        ]}
                    />
                </Form>
            </>
        );
    }
}
