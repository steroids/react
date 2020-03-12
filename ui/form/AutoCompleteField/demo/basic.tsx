import * as React from 'react';

import AutoCompleteField from '../AutoCompleteField';

/**
 * Basic
 * @order 1
 * @col 6
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <AutoCompleteField
                    label='Write city'
                    items={[
                        'Moscow',
                    ]}
                />
            </>
        );
    }
}
