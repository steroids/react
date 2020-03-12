import * as React from 'react';

import CheckboxField from '../CheckboxField';


/**
 * Required
 * @order 3
 * @col 3
 */
export default class extends React.PureComponent {
    render() {
        return (
            <>
                <CheckboxField label='Required' required/>
            </>
        );
    }
}
