import SwitcherField from '@steroidsjs/core/ui/form/SwitcherField/SwitcherField';
import * as React from 'react';
import {items} from './basic';

export default () => (
    <>
        <SwitcherField
            label='Required'
            items={items}
            required
        />
    </>
);
