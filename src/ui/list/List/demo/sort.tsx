import List from '@steroidsjs/core/ui/list/List';
import * as React from 'react';

/**
 * List with sorting
 * @order 8
 * @col 6
 */
export default () => (
    <List
        listId='ListDemoSort'
        items={[
            {
                id: 1,
                price: 50,
                title: 'Jeans',
            },
            {
                id: 2,
                price: 125,
                title: 'Coat',
            },
            {
                id: 3,
                price: 18,
                title: 'Shirt',
            },
            {
                id: 4,
                price: 62,
                title: 'Dress',
            },
            {
                price: 100,
                title: 'Boots',
            },
        ]}
        className='list-group'
        searchForm={{
            layout: 'horizontal',
            fields: ['sort'],
            model: {
                attributes: [
                    {
                        attribute: 'sort',
                        label: 'Sort',
                        searchField: 'DropDownField',
                        searchFieldProps: {
                            items: [
                                {
                                    id: '-price',
                                    label: 'Descending price',
                                },
                                {
                                    id: 'price',
                                    label: 'Ascending price',
                                },
                            ],
                        },
                    },
                ],
            },
        }}
        sort={{
            enable: true,
            defaultValue: '-price',
        }}
        itemView={(props: any) => (
            <div className='list-group-item'>
                <div>{props.item.title}</div>
                <div>{`Price: ${props.item.price} $`}</div>
            </div>
        )}
    />
);
