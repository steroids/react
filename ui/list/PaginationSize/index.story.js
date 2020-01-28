import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';
import {text, array, select, number} from '@storybook/addon-knobs/react';

import PaginationSize from './PaginationSize';
import _upperFirst from 'lodash-es/upperFirst';

import README from './README.md'
import {withReadme} from 'storybook-readme';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

storiesOf('List', module)
    .addDecorator(withReadme(README))
    .add('PaginationSize', context => (
        <div>
            {withInfo()(() => (
                <PaginationSize
                    //PaginationSize.defaultProps not working
                    sizes={array('Sizes', [30, 50, 100])}
                    className={text('Class', '')}
                    size={select('Size', sizes, 'sm')}
                />
            ))(context)}
            <div className='row'>
                {Object.keys(sizes).map(size => (
                    <div className='col' key = {size}>
                        <h6>
                            {_upperFirst(size)}
                        </h6>
                        <PaginationSize
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