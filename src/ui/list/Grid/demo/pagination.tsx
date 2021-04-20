import * as React from 'react';

import Grid from '../Grid';
import {searchForm, items} from './load-more';

export default () => (
    <>
        <h6>
            Pagination
        </h6>
        <Grid
            listId='ListStoryPagination'
            items={items}
            columns={[
                {
                    label: 'Name',
                    attribute: 'name',
                    // visible: false,
                },
                {
                    label: __('Second name'),
                    attribute: 'secondName',
                },
                {
                    label: 'Work',
                    attribute: 'work',
                },
            ]}
            searchForm={searchForm}
            paginationSize={{
                enable: true,
                defaultValue: 30,
            }}
            pagination={{
                enable: true,
                loadMore: false,
            }}
        />
    </>
);
