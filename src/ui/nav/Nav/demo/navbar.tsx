import * as React from 'react';

import Nav from '../Nav';

export default () => (
    <>
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