import * as React from 'react';

import Link from '../Link';

/**
 * Button with icon
 * @order 6
 * @col 4
 */
export default () => (
    <>
        <Link
            label={__('Icon')}
            icon='phone'
            url='https://google.ru'
            target='_blank'
            className='d-block mb-3'
        />
    </>
);
