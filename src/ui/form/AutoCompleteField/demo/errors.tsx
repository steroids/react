import * as React from 'react';
import AutoCompleteField from '../AutoCompleteField';
import {items} from './basic';

export default () => (
    <>
        <AutoCompleteField
            label='Errors'
            items={items}
            errors={['Error 1 text', 'Error 2 text']}
        />
    </>
);
