import * as React from 'react';

import List from '../List';

/**
 * Empty view with custom text when no items
 * @order 3
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <List
                listId='ListDemoPaginationEmpty'
                items={[]}
                empty='Empty data'
            />
        );
    }
}