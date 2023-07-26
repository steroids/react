import React from 'react';
import {MaskitoOptions} from '@maskito/core';
import InputField, {IInputFieldProps} from '../InputField/InputField';

/**
 * MaskField
 *
 * Компонент поля ввода текста с маской.
 **/
export type IMaskFieldProps = IInputFieldProps

function MaskField(props: IMaskFieldProps): JSX.Element {
    const {mask, maskProps, ...inputProps} = props;

    return (
        <InputField
            {...inputProps}
            maskOptions={props.maskOptions}
        />
    );
}

export default MaskField;
