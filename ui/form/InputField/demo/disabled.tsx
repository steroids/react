import * as React from 'react';

import InputField from '../InputField';


/**
 * Disabled
 * @order 2
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <InputField label='Disabled' disabled/>
            </>
        );
    }
}
