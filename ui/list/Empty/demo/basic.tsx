import * as React from 'react';

import Empty from '../Empty';

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <Empty
                    text='Записей не найдено'
                />
            </>
        );
    }
}