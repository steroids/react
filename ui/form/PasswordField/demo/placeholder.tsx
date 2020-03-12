import * as React from 'react';

import PasswordField from '../PasswordField';


/**
 * Placeholder
 * @order 4
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <PasswordField label='Placeholder' placeholder='Your password...'/>
            </>
        );
    }
}
