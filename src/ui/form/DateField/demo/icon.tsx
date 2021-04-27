import * as React from 'react';

import DateField from '../DateField';

/**
 * Icons
 * @order 5
 * @col 6
 */
export default () => (
    <>
        <DateField label='Default' icon />
        <DateField label='With error' icon errors={['Error 1 text']} />
        <DateField label='Custom' icon='dizzy' />
    </>
);
