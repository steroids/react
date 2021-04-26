import * as React from 'react';

import Link from '../Link';

/**
 * Button with badge
 * @order 3
 * @col 4
 */
export default () => (
    <>
        <Link
            url='https://google.ru'
            target='_blank'
            badge={2}
            label={__('Badge')}
            className='d-block mb-3'
        />
    </>
);
