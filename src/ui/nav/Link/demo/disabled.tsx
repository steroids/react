import * as React from 'react';

import Link from '../Link';

/**
 * Disabled
 * @order 3
 * @col 4
 */
export default () => (
    <>
        <Link
            disabled
            url='https://google.ru'
            target='_blank'
            label='Disabled'
            className='d-block mb-3'
        />
    </>
);
