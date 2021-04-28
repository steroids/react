import * as React from 'react';
import Tree from '../Tree';
import {items} from './basic';

/**
 * The max available nesting level is 2
 * @order 2
 * @col 8
 */
export default () => (
    <>
        <Tree
            items={items}
            level={2}
        />
    </>
);
