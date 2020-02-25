import * as React from 'react';

import InputField from '../InputField';


/**
 * Required
 * @order 3
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <InputField label='Required' required/>
            </>
        );
    }
}
