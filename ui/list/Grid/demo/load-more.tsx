import * as React from 'react';

import Grid from '../Grid';
import DateField from '../../../form/DateField/DateField';
import InputField from '../../../form/InputField/InputField';

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
            component: DateField,
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
                defaultValue: 10,
            }}
        />
    </>
);
