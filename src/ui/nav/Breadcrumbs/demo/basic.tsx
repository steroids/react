import * as React from 'react';
import Breadcrumbs from '../Breadcrumbs';

/**
 * Самый простой способ построить цепочку Breadcrumbs - передать id целевого роута.
 * @order 1
 * @col 6
 */
export default () => (
    <>
        <Breadcrumbs pageId='react' />
    </>
);
