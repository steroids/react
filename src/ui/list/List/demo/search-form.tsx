import * as React from 'react';
import List from '../List';

/**
 * List with search form, address bar and custom pagination
 * @order 6
 * @col 6
 */
export default () => (
    <List
        listId='ListDemoPaginationSearch'
        items={[
            {
                id: 1,
                name: 'Hamster',
                category: 'mammals',
            },
            {
                id: 2,
                name: 'Mockingbird',
                category: 'birds',
            },
            {
                id: 3,
                name: 'Raccoon',
                category: 'mammals',
            },
            {
                id: 4,
                name: 'Python',
                category: 'reptiles',
            },
            {
                id: 5,
                name: 'Dolphin',
                category: 'mammals',
            },
            {
                id: 6,
                name: 'Turtles',
                category: 'reptiles',
            },
        ]}
        searchForm={{
            layout: 'horizontal',
            fields: [
                'name',
                'category',
            ],
            model: {
                attributes: [
                    'name:string:Name',
                    {
                        attribute: 'category',
                        label: 'Category',
                        searchField: 'DropDownField',
                        searchFieldProps: {
                            items: [
                                {
                                    id: 'mammals',
                                    label: 'Mammals',
                                },
                                {
                                    id: 'birds',
                                    label: 'Birds',
                                },
                                {
                                    id: 'reptiles',
                                    label: 'Reptiles',
                                },
                            ],
                        },
                    },
                ],
            },
        }}
        paginationSize={{
            attribute: 'ps',
            sizes: [2, 4],
        }}
        addressBar
        className='list-group'
        itemView={(props: any) => (
            <div className='list-group-item'>
                <div>{props.item.name}</div>
                <div>{`Category: ${props.item.category}`}</div>
            </div>
        )}
    />
);
