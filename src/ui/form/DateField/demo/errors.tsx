import * as React from 'react';
import DateField from '../DateField';

export default () => (
    <>
        <div>
            <DateField
                label='Errors'
                errors={['Error 1 text', 'Error 2 text']}
                layout
            />
        </div>
    </>
);
