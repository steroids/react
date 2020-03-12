import * as React from 'react';

import CheckboxField from '../CheckboxField';


/**
 * Disabled
 * @order 2
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <CheckboxField label='Disabled' disabled/>
            </>
        );
    }
}
