import * as React from 'react';
import DateRangeField from '../DateRangeField';

/**
 * Обычный пример использования DateRangeField.
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
