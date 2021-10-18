import * as React from 'react';
import DateTimeField from '../DateTimeField';

/**
 * Справа в инпуте кастомная иконка
 * @order 5
 * @col 6
 */
export default () => (
    <>
        <DateTimeField
            label='Custom icon'
            icon='plane'
            dateProps={{
                icon: true,
            }}
        />
    </>
);
