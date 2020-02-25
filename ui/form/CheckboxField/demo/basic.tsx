import * as React from 'react';

import CheckboxField from '../CheckboxField';

export default class extends React.PureComponent {
    render() {
        return (
            <>
                <CheckboxField
                    label={'Remember me'}
                />
                <div className='row mb-4'>
                    <div className='col-2'>
                        <CheckboxField label='Disabled' disabled/>
                    </div>
                    <div className='col-2'>
                        <CheckboxField label='Required' required/>
                    </div>
                    <div className='col-2'>
                        <CheckboxField label='Errors' errors={['Error 1 text', 'Error 2 text']}/>
                    </div>
                </div>
            </>
        );
    }
}