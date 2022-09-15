import List from '../List';
import * as React from 'react';

/**
 * List with filtration by custom condition
 * @order 7
 * @col 6
 */
export default () => (
    <List
        listId='ListDemoCondition'
        items={[
            {
                id: 1,
                name: 'Michael',
                age: 21,
            },
            {
                id: 2,
                name: 'Brad',
                age: 20,
            },
            {
                id: 3,
                name: 'Charles',
                age: 15,
            },
            {
                id: 4,
                name: 'Martin',
                age: 18,
            },
            {
                id: 5,
                name: 'Kevin',
                age: 14,
            },
            {
                id: 6,
                name: 'Jacob',
                age: 17,
            },
        ]}
        searchForm={{
            layout: 'horizontal',
            fields: [
                'isAdult',
            ],
            model: {
                attributes: [
                    {
                        attribute: 'isAdult',
                        searchField: 'CheckboxField',
                        searchFieldProps: {
                            label: 'Age over 18',
                        },
                    },
                ],
            },
        }}
        condition={(query) => {
            if (query?.isAdult) {
                return ['>=', 'age', 18];
            }

            return [];
        }}
        className='list-group'
        // @ts-ignore
        itemView={(props: any) => (
            <div className='list-group-item'>
                <div>{props.item.name}</div>
                <div>{`Age: ${props.item.age}`}</div>
            </div>
        )}
    />
);
