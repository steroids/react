import * as React from 'react';
import Tree from '../Tree'
import {ROUTE_ROOT} from '../../../../../../frontend/routes';

export default () => (
    <>
        <Tree
            items={ROUTE_ROOT}
        />
    </>
);