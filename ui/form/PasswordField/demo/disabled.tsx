import * as React from 'react';

import PasswordField from '../PasswordField';


/**
 * Disabled
 * @order 2
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <PasswordField label='Disabled' disabled/>
            </>
        );
    }
}
