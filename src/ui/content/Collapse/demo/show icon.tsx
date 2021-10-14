import * as React from 'react';
import Collapse from '../Collapse';
import CollapseItem from '../CollapseItem';

/**
 * Show or hide icon
 * @order 6
 * @col 6
 */

export default () => (
    <>
        <Collapse activeKey={1}>
            <CollapseItem>Custom icon</CollapseItem>
            <CollapseItem showIcon={false}>Custom icon</CollapseItem>
            <CollapseItem>Custom icon</CollapseItem>
        </Collapse>
    </>
);
