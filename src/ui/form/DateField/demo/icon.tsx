import * as React from 'react';

import DateField from '../DateField';

/**
 * С использованием кастомной иконкой.
 * @order 5
 * @col 6
 */

export default () => (
    <>
        <DateField
            label='Default'
            icon
        />
        <DateField
            label='With error'
            icon='plane'
            errors={['Error 1 text']}
        />
        <DateField
            label='Custom'
            icon='dizzy'
        />
    </>
);
