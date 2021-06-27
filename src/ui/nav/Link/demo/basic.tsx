import * as React from 'react';
import Link from '../Link';

/**
 * Basic
 * @order 1
 * @col 4
 */
export default () => (
    <>
        <Link
            url='https://google.ru'
            target='_blank'
            label={__('Basic')}
            className='d-block mb-3'
        />
    </>
);
