import * as React from 'react';
import RadioListField from '../RadioListField';
import {items} from './basic';

export default () => (
    <>
        <RadioListField
            label='Disabled'
            disabled
            items={items}
        />
    </>
);
