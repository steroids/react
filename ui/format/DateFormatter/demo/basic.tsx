import * as React from 'react';

import DateFormatter from '../DateFormatter';

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <DateFormatter
                    value='2018-05-04'
                />
            </>
        );
    }
}
