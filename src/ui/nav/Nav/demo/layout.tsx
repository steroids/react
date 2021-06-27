import * as React from 'react';
import _startCase from 'lodash-es/startCase';
import {items} from '../../../nav/Nav/demo/basic';
import Nav from '../Nav';

const layouts = ['button', 'icon', 'link', 'tabs', 'navbar', 'list'];
const icons = ['coffee', 'shopping-basket', 'hospital'];

/**
 * Nav with different layouts
 * @order 2
 * @col 12
 */
export default () => (
    <>
        <div className='row'>
            {layouts.map(layout => (
                <div
                    className='col-8 mb-5'
                    key={layout}
                >
                    <h6>{_startCase(layout)}</h6>
                    <Nav
                        items={layout === 'icon'
                            ? items.map((item, index) => ({
                                ...item,
                                icon: icons[index],
                            }))
                            : items}
                        layout={layout}
                    />
                </div>
            ))}
        </div>
    </>
);
