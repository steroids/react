import * as React from 'react';

import List from '../List';
import InputField from '../../../form/InputField/InputField';
import DateField from '../../../form/DateField/DateField';

class ItemView extends React.PureComponent<{ item: any }> {
    render() {
        return (
            <div className='card mb-3'>
                <div className='card-body'>
                    ItemView {this.props.item}
                </div>
            </div>
        );
    }
}

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

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <div className='row'>
                    <div className='col'>
                        <h6>
                            Load more
                        </h6>
                        <List
                            listId='ListStoryLoadMore'
                            total={100}
                            defaultPageSize={10}
                            items={[1, 2]}
                            itemView={ItemView}
                            searchForm={searchForm}
                            loadMore
                        />
                    </div>
                    <div className='col'>
                        <h6>
                            Pagination
                        </h6>
                        <List
                            listId='ListStoryPagination'
                            total={100}
                            defaultPageSize={10}
                            items={[1, 2]}
                            itemView={ItemView}
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
                        <List
                            listId='ListStoryReverse'
                            total={100}
                            defaultPageSize={10}
                            items={[1, 2]}
                            itemView={ItemView}
                            searchForm={searchForm}
                            paginationSizeView={true}
                            paginationView={true}
                            loadMore={false}
                            reverse
                        />
                    </div>
                </div>
            </>
        );
    }
}