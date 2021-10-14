import * as React from 'react';
import Collapse from '../Collapse';
import CollapseItem from '../CollapseItem';

/**
 * Basic
 * @order 1
 * @col 6
 */

export default () => (
    <div style={{minHeight: '255px'}}>
        <Collapse>
            <CollapseItem title='Show more'>1</CollapseItem>
            <CollapseItem title='Show more'>2</CollapseItem>
            <CollapseItem title='Show more'>3</CollapseItem>
        </Collapse>
    </div>
);
