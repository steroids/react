import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './auto-complete';

export default () => (
    <>
        <DropDownField
            label='Show reset'
            showReset
            items={items}
        />
    </>
);