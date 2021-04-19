import * as React from 'react';
import CheckboxListField from '../CheckboxListField';
import {items} from './basic';

export default () => (
    <>
        <CheckboxListField
            label='Required'
            items={items}
            required
        />
    </>
);
