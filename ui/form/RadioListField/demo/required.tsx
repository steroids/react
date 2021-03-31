import * as React from 'react';
import RadioListField from '../RadioListField';
import {items} from './disabled'

export default () => (
    <>
        <RadioListField
            label='Required'
            items={items}
            required
        />
    </>
);