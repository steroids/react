import * as React from 'react';

import Button from '../Button';

/**
 * Button with badge
 * @order 3
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
