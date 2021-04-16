import * as React from 'react';

import DateField from '../DateField';

export default () => (
    <>
        <div>
            <DateField label='Default' icon />
            <DateField label='With error' icon errors={['Error 1 text']} />
            <DateField label='Custom' icon='dizzy' />
        </div>
    </>
);
