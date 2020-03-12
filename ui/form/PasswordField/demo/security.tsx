import * as React from 'react';

import PasswordField from '../PasswordField';


/**
 * Security
 * @order 7
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <PasswordField label='Security' security/>
            </>
        );
    }
}
