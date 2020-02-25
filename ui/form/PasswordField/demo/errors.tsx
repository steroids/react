import * as React from 'react';

import PasswordField from '../PasswordField';


/**
 * Errors
 * @order 6
 * @col 4
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <PasswordField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
            </>
        );
    }
}
