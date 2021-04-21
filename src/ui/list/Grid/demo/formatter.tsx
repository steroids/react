import * as React from 'react';

import Grid from '../Grid';
import DateFormatter from '../../../format/DateFormatter';

/**
 * Grid with DateFormatter (format: 'DD MMMM')
 * @order 7
 * @col 6
 */
export default () => (
    <>
        <Grid
            listId='GridFormatterDemo'
            items={[
                {
                    date: '2021-09-11',
                    route: 'Krasnoyarsk - Moscow',
                },
                {
                    date: '2021-09-15',
                    route: 'Krasnoyarsk - Krasnodar',
                },
                {
                    date: '2021-09-20',
                    route: 'Krasnoyarsk - Tomsk',
                },
            ]}
            columns={[
                {
                    attribute: 'route',
                    label: 'Route',
                },
                {
                    attribute: 'date',
                    label: 'Date',
                    formatter: {
                        component: DateFormatter,
                        format: 'DD MMMM',
                    },
                },
            ]}
        />
    </>
);
