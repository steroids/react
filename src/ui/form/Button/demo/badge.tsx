import * as React from 'react';

import Button from '../Button';

/**
 * Кнопка с бэйджом к примеру с количеством уведомолений.
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
