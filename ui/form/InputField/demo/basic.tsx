import * as React from 'react';

import InputField from '../InputField';

/**
 * Basic
 * @order 1
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <InputField label='Input'/>
            </>
        );
    }
}
