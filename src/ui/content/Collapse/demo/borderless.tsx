import * as React from 'react';
import Collapse from '../Collapse';
import CollapseItem from '../CollapseItem';

/**
 * Borderless mode
 * @order 3
 * @col 6
 */

export default () => (
    <div style={{minHeight: '255px'}}>
        <Collapse borderless>
            <CollapseItem title='borderless'>1</CollapseItem>
            <CollapseItem title='borderless'>2</CollapseItem>
            <CollapseItem title='borderless'>3</CollapseItem>
        </Collapse>
    </div>
);
