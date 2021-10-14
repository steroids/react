import * as React from 'react';
import Collapse from '../Collapse';
import CollapseItem from '../CollapseItem';

/**
 * Disable CollapseItem
 * @order 4
 * @col 6
 */

export default () => (
    <div style={{minHeight: '255px'}}>
        <Collapse activeKey={1}>
            <CollapseItem>1</CollapseItem>
            <CollapseItem disabled title='disable'>2</CollapseItem>
            <CollapseItem>3</CollapseItem>
        </Collapse>
    </div>
);
