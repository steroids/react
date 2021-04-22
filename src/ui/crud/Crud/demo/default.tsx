import * as React from 'react';
import Crud from '../Crud';

/**
 * Default
 * @order 1
 * @col 8
 */
export default () => (
    <>
        <Crud
            grid={{
                items: [
                    {
                        id: 1,
                        name: 'Foo',
                    },
                    {
                        id: 2,
                        name: 'Bar',
                    },
                ],
                columns: [
                    {
                        attribute: 'id',
                        label: __('ИД'),
                    },
                    {
                        attribute: 'name',
                        label: __('Имя'),
                    },
                ],
            }}
            form={{
                fields: [
                    {
                        attribute: 'name',
                        label: __('Имя'),
                    },
                ]
            }}
            detail={{
                attributes: [
                    {
                        attribute: 'id',
                        label: __('ИД'),
                    },
                    {
                        attribute: 'name',
                        label: __('Имя'),
                    },
                ]
            }}
        />
    </>
)