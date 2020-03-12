import * as React from 'react';

import CheckboxField from '../CheckboxField';

/**
 * Basic
 * @order 1
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <CheckboxField label={'Remember me'}/>
            </>
        );
    }
}
