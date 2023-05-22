import React from 'react';
import fieldWrapper from '../Field/fieldWrapper';
import InputField, {IInputFieldProps} from '../InputField/InputField';

export interface IMaskFieldProps extends IInputFieldProps {
    mask?: string,
}

function MaskField(props: IMaskFieldProps): JSX.Element {
    const {mask, maskProps, ...inputProps} = props;

    return (
        <InputField
            {...inputProps}
            maskProps={{
                mask,
                ...maskProps,
            }}
        />
    );
}

export default MaskField;
