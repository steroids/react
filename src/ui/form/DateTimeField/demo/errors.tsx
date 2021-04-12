import * as React from 'react';
import DateTimeField from '../DateTimeField';

export default () => (
    <>
        <div>
            <DateTimeField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
        </div>
    </>
);