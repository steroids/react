import * as React from 'react';

import DateRangeField from '../DateRangeField';

/**
 * Basic
 * @order 1
 * @col 6
 */
export default () => (
    <>
        <DateRangeField
            attributeFrom='fromTime'
            attributeTo='toTime'
        />
    </>
);
