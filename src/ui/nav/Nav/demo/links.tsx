import * as React from 'react';

import Nav from '../Nav';
import {items} from './buttons';

export default () => (
    <>
        <h6>
            Links
        </h6>
        <Nav layout={'link'} items={items}/>
    </>
);