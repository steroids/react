/* eslint-disable max-len */
import * as React from 'react';
import Card from '../Card';

/**
 * Body
 * @order 4
 * @col 12
 */

export default () => (
    <div style={{display: 'flex', gridGap: '40px'}}>
        <Card title='Card title'>
            All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.
        </Card>
        <Card>
            All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.
        </Card>
    </div>
);
