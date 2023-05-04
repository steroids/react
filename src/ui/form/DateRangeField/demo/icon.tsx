import * as React from 'react';

import DateRangeField from '../DateRangeField';

/**
 * С использованием кастомной иконкой.
 * @order 5
 * @col 6
 */

export default () => (
    <>
        <DateRangeField
            label='Default'
            icon
        />
        <DateRangeField
            label='With error'
            icon='user'
            errors={['Error 1 text']}
        />
        <DateRangeField
            label='Custom'
            icon='map'
        />
    </>
);
