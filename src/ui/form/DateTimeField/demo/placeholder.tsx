import * as React from 'react';
import DateTimeField from '../DateTimeField';

export default () => (
    <>
        <DateTimeField
            label='Placeholder'
            dateProps={{
                placeholder: 'Your date...',
            }}
            timeProps={{
                placeholder: 'Your time...',
            }}
        />
    </>
);
