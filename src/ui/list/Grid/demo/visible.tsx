import * as React from 'react';

import Grid from '../Grid';
import {searchForm, items} from './load-more';

export default () => (
    <>
        <h6>
            Visible (column Work - visible: false)
        </h6>
        <Grid
            listId='ListStoryReverse'
            items={items}
            columns={[
                {
                    label: 'Name',
                    attribute: 'name',
                },
                {
                    label: __('Second name'),
                    attribute: 'secondName',
                },
                {
                    label: 'Work',
                    attribute: 'work',
                    visible: false,
                },
            ]}
            paginationSize={{
                enable: true,
                defaultValue: 30,
            }}
            searchForm={searchForm}
        />
    </>
);
