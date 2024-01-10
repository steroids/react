import React from 'react';
import InputField, {IInputFieldProps} from '../InputField/InputField';

/**
 * MaskField
 *
 * Компонент поля ввода текста с маской.
 **/
export type IMaskFieldProps = IInputFieldProps

function MaskField(props: IMaskFieldProps): JSX.Element {
    return (
        <InputField {...props} />
    );
}

export default MaskField;
