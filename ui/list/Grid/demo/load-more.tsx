import * as React from 'react';

import Grid from '../Grid';
//import DateField from '../../../form/DateField/DateField';
import InputField from '../../../form/InputField/InputField';
import List from '@steroidsjs/core/ui/list/List';

export const searchForm = {
    fields: [
        {
            label: 'Input',
            attribute: 'input',
            component: InputField,
        },
        {
            label: 'Date',
            attribute: 'date',
            component: InputField,
        },
    ],
};

export const items = [
    {
        name: 'Ivan',
        secondName: 'Ivanov',
        work: 'development',
    },
    {
        name: 'Petr',
        secondName: 'Petrov',
        work: 'manager',
    },
    {
        name: 'Jhon',
        secondName: 'Doe',
        work: 'designer',
    },
];

export default () => (
    <>
        <h6>
            Load more
        </h6>
        <Grid
            listId='ListStoryLoadMore'
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
                },
            ]}
            searchForm={searchForm}
            pagination={{
                loadMore: true,
            }}
            paginationSize={{
                defaultValue: 3,
                sizes: [2, 3, 4],
            }}
        />
    </>
);
