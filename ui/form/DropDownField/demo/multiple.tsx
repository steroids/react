import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './auto-complete';

export default () => (
    <>
        <DropDownField
            label='Multiple'
            multiple
            items={items}
        />
    </>
);