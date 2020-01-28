import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {boolean, select, number} from '@storybook/addon-knobs/react';
import _upperFirst from 'lodash-es/upperFirst';

import Pagination from './Pagination';

import README from './README.md'
import {withReadme} from 'storybook-readme';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('List', module)
    .addDecorator(withReadme(README))
    .add('Pagination', context => (
        <div>
            {withInfo()(() => (
                <Pagination
                    //Pagination.defaultProps not working
                    aroundCount={number('Around Count', 3)}
                    list={{
                        page: number('Page', 2),
                        pageSize: number('Page Size', 10),
                        total: number('Total', 100),
                    }}
                    loadMore={boolean('Load more', false)}
                    size={select('Size', sizes, 'md')}
                />
            ))(context)}
            <div className='row'>
                <div className='col'>
                    <h6>
                        Load more
                    </h6>
                    <Pagination
                        aroundCount={number('Around Count', 3)}
                        list={{
                            page: 2,
                            pageSize: 20,
                            total: 100,
                        }}
                        loadMore
                    />
                </div>
                {Object.keys(sizes).map(size => (
                    <div className='col' key = {size}>
                        <h6>
                            {_upperFirst(size)}
                        </h6>
                        <Pagination
                            aroundCount={number('Around Count', 3)}
                            list={{
                                page: 2,
                                pageSize: 20,
                                total: 100,
                            }}
                            size={size}
                        />
                    </div>
                ))}
            </div>
        </div>
    ));