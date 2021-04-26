import * as React from 'react';
import ControlsColumn from '@steroidsjs/core/ui/list/ControlsColumn';
import {controls} from '../../../nav/Controls/demo/basic';

/**
 * Basic
 * @order 1
 * @col 8
 */
export default () => (
    <>
        <ControlsColumn
            controls={controls.map(item => ({
                ...item,
                visible: true,
            }))}
            item={{}}
        />
    </>
);
