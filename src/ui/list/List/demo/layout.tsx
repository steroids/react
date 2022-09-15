import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';

/**
 * List with layout switcher
 * @order 5
 * @col 6
 */
export default () => (
    <List
        listId='ListDemoLayout'
        items={demoItems}
        layout={{
            items: [
                {
                    id: 'list',
                    label: 'List',
                },
                {
                    id: 'grid',
                    label: 'Grid',
                },
            ],
        }}
        contentClassName='row mx-lg-n1'
        // @ts-ignore
        itemView={(props: any) => (
            <div className={`py-1 px-lg-1 ${props.layoutSelected === 'list' ? 'col-12' : 'col-6'}`}>
                <div className='card p-2'>
                    {props.item.title}
                </div>
            </div>
        )}
    />
);
