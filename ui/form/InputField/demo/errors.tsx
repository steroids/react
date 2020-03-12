import * as React from 'react';

import InputField from '../InputField';


/**
 * Errors
 * @order 7
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <InputField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
            </>
        );
    }
}
