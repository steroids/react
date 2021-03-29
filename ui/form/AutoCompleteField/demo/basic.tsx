import * as React from 'react';

import AutoCompleteField from '../AutoCompleteField';

/**
 * Basic
 * @order 1
 * @col 6
 */
export default () => (
    <>
        <AutoCompleteField
            label='Write city'
            items={[
                {
                    id: '1',
                    label: 'Moscow',
                },
                {
                    id: '2',
                    label: 'Krasnoyarsk',
                },
                {
                    id: '3',
                    label: 'Krasnodar',
                },
            ]}
        />
    </>
);
