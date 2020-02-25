import * as React from 'react';

import Grid from '../Grid';
import DateField from '../../../form/DateField/DateField';
import InputField from '../../../form/InputField/InputField';

const searchForm = {
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

const items = [
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

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <div className='row mb-4'>
                    <div className='col'>
                        <h6>
                            Load more
                        </h6>
                        <Grid
                            listId='ListStoryLoadMore'
                            total={100}
                            defaultPageSize={10}
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
                            loadMore
                        />
                    </div>
                    <div className='col'>
                        <h6>
                            Pagination
                        </h6>
                        <Grid
                            listId='ListStoryPagination'
                            total={100}
                            defaultPageSize={10}
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
                            paginationSizeView={true}
                            paginationView={true}
                            loadMore={false}
                        />
                    </div>
                    <div className='col'>
                        <h6>
                            Reverse
                        </h6>
                        <Grid
                            listId='ListStoryReverse'
                            total={100}
                            defaultPageSize={10}
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
                            paginationSizeView={true}
                            paginationView={true}
                            loadMore={false}
                            reverse
                        />
                    </div>
                </div>
                <div className='row mb-4'>
                    <div className='col-4'>
                        <h6>
                            Visible (column Work - visible: false)
                        </h6>
                        <Grid
                            listId='ListStoryReverse'
                            total={100}
                            defaultPageSize={10}
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
                            searchForm={searchForm}
                        />
                    </div>
                </div>
            </>
        );
    }
}