import * as React from 'react';

import List from '../List';
import {demoItems} from './basic';

/**
 * Pagination with layout switcher
 * @order 5
 * @col 6
 */
export default class extends React.PureComponent {
    render() {
        return (
            <List
                listId='ListDemoPaginationLayout'
                items={demoItems.slice(0, 4)}
                total={demoItems.length}
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
                    ]
                }}
                contentClassName='row mx-lg-n1'
                itemView={(props: any) => (
                    <div className={`py-1 px-lg-1 ${props.layoutSelected === 'list' ? 'col-12' : 'col-6'}`}>
                        <div className='card p-2'>
                            {props.item.title}
                        </div>
                    </div>
                )}
            />
        );
    }
}