import React, {useMemo} from 'react';
import InputField, {IInputFieldProps} from '../InputField/InputField';

/**
 * MaskField
 *
 * Компонент поля ввода текста с маской.
 **/
export type IMaskFieldProps = IInputFieldProps

function MaskField(props: IMaskFieldProps): JSX.Element {
    const {mask, maskProps, ...inputProps} = props;

    const viewProps = useMemo(() => ({
        ...inputProps,
        maskOptions: props.maskOptions,
        mask,
        maskProps,
    }), [inputProps, mask, maskProps, props.maskOptions]);

    return (
        <InputField {...viewProps} />
    );
}

export default MaskField;
