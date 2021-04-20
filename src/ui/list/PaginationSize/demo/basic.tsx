import * as React from 'react';

import PaginationSize from '../PaginationSize';
import {demoItems} from '../../../../ui/list/List/demo/basic';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

export default () => (
    <>
        <div className='row'>
            {Object.keys(sizes)
                .map(size => (
                    <div className='col' key={size}>
                        <h6>
                            {sizes[size]}
                        </h6>
                        <PaginationSize
                            list={{
                                page: 2,
                                pageSize: 3,
                                total: 100,
                                items: demoItems,
                            }}
                            enable
                            attribute='pageSize'
                            sizes={[3, 6, 9]}
                            defaultValue={3}
                            size={size}
                            position='top'
                        />
                    </div>
                ))}
        </div>
    </>
);
