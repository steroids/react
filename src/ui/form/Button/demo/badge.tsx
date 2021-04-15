import * as React from 'react';

import Button from '../Button';

/**
 * Button with badge
 * @order 6
 * @col 4
 */
export default () => (
    <>
        <Button
            badge={2}
            label={__('Badge')}
        />
    </>
);
