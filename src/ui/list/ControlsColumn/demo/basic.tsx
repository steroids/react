import * as React from 'react';
import ControlsColumn from '../ControlsColumn';

/**
 * Basic
 * @order 1
 * @col 8
 */
export default () => (
    <>
        <ControlsColumn
            controls={['back', 'create', 'view', 'update', 'delete'].map(id => ({
                id,
                visible: true,
            }))}
            item={{}}
        />
    </>
);
