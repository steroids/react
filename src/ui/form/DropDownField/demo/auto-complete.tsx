import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './basic';

export default () => (
    <>
        <DropDownField
            label='Auto Complete'
            autoComplete
            items={items}
        />
    </>
);
