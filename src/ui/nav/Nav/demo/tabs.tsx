import * as React from 'react';

import Nav from '../Nav';
import {items} from './buttons';

export default () => (
    <>
        <h6>
            Tabs
        </h6>
        <Nav layout={'tabs'} items={items}/>
    </>
);