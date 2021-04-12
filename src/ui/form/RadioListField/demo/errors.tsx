import * as React from 'react';
import RadioListField from '../RadioListField';
import {items} from './disabled';

export default () => (
    <>
        <RadioListField
            label='Errors'
            errors={['Error 1 text', 'Error 2 text']}
            items={items}
        />
    </>
);
