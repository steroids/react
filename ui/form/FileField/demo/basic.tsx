import * as React from 'react';

import FileField from '../FileField';

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <FileField
                    label='File'
                />
            </>
        );
    }
}
