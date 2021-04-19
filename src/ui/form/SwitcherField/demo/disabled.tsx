import SwitcherField from '@steroidsjs/core/ui/form/SwitcherField/SwitcherField';
import * as React from 'react';
import {items} from './basic';

export default () => (
    <>
        <SwitcherField
            label='Disabled'
            items={items}
            disabled
        />
    </>
);
