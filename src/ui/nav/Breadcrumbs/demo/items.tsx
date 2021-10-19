import * as React from 'react';
import Breadcrumbs from '../Breadcrumbs';

/**
 * Передаем заданный массив роутов.
 * @order 3
 * @col 12
 */
export default () => (
    <>
        <Breadcrumbs
            items={[
                {id: 'root', title: 'Home'},
                {id: 'react', title: 'Frontend React'},
                {id: 'ui', title: 'Ui'},
                {id: 'Breadcrumbs', title: 'Breadcrumbs'},
            ]}
        />
    </>
);
