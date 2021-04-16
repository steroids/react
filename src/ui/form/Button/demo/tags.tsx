import * as React from 'react';

import Button from '../Button';

/**
 * Tags
 * @order 8
 * @col 4
 */
export default () => (
    <>
        <Button
            label={__('button')}
            tag='button'
        />
        <Button
            label={__('a')}
            tag='a'
        />
    </>
);
