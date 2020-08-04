import * as React from 'react';
import DropDownField from '../DropDownField';
import {items} from './auto-complete';

export default () => (
    <>
        <DropDownField
            label='Errors'
            errors={['Error 1 text', 'Error 2 text']}
            items={items}
        />
    </>
);