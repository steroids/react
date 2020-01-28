import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {select} from '@storybook/addon-knobs/react';
import {withReadme} from 'storybook-readme';
import _upperFirst from 'lodash-es/upperFirst';

import README from './README.md';
import Nav from './Nav';

const layouts = {
    tabs: 'Tabs',
    button: 'Buttons',
    link: 'Links',
};

const items = [
    {
        id: 'one',
        label: 'One',
        content: () => (
            <div className='card'>
                <div className='card-body'>
                    One
                </div>
            </div>
        )
    },
    {
        id: 'two',
        label: 'Two',
        content: () => (
            <div className='card'>
                <div className='card-body'>
                    Two
                </div>
            </div>
        )
    },
    {
        id: 'three',
        label: 'Three',
        content: () => (
            <div className='card'>
                <div className='card-body'>
                    Three
                </div>
            </div>
        )
    },
];

storiesOf('Nav', module)
    .addDecorator(withReadme(README))
    .add('Nav', context => (
        <div>
            {withInfo()(() => (
                <Nav
                    layout={select('Layout', layouts, 'button')}
                    items={items}
                />
            ))(context)}

            <div className='row mb-4'>
                {Object.keys(layouts).map(layout => (
                    <div className='col' key={layout}>
                        <h6>
                            {_upperFirst(layout)}
                        </h6>
                        <Nav layout={layout} items={items}/>
                    </div>
                ))}
            </div>
            <div className='row mb-4'>
                <div className='col'>
                    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                        <div className='container'>
                            <a className='navbar-brand' href='#'>Navbar</a>
                            <Nav
                                layout='navbar'
                                items={[
                                    {
                                        id: 1,
                                        label: 'One'
                                    },
                                    {
                                        id: 2,
                                        label: 'Two'
                                    },
                                    {
                                        id: 3,
                                        label: 'Three'
                                    },
                                ]}
                            />
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    ));
