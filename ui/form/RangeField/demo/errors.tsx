import * as React from 'react';
import RangeField from '../RangeField';

export default () => (
    <>
        <RangeField
            label='Errors'
            errors={['Error 1 text', 'Error 2 text']}
        />
    </>
);