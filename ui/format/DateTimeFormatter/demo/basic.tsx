import * as React from 'react';

import DateTimeFormatter from '../DateTimeFormatter';

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <DateTimeFormatter
                    value='2018-05-04 16:15:00'
                />
            </>
        );
    }
}