import * as React from 'react';

import Nav from '../Nav';

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

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <div className='row mb-4'>
                    {Object.keys(layouts).map(layout => (
                        <div className='col' key={layout}>
                            <h6>
                                {layouts[layout]}
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
            </>
        );
    }
}
