import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './auto-complete';

export default () => (
    <div
        style={{width: '100px'}}
    >
        <DropDownField
            label='No border'
            noBorder
            selectFirst
            items={items}
        />
    </div>
);
