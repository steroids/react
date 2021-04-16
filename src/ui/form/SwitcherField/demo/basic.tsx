import * as React from 'react';
import SwitcherField from '../SwitcherField';

export const items = ['First', 'Second', 'Third'];

export default () => (
    <>
        <SwitcherField
            label='Basic'
            items={items}
        />
    </>
);
