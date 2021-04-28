import NavField from '../NavField';
import * as React from 'react';
import {items} from './basic';

export default () => (
    <>
        <NavField
            items={items}
            label='Disabled'
            disabled
        />
    </>
);
