import * as React from 'react';

import Button from '../Button';

/**
 * Tags
 * @order 11
 * @col 6
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
