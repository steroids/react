import React from 'react';

import InputField, {IInputFieldProps} from '../InputField/InputField';

/**
 * MaskField
 *
 * Компонент поля ввода текста с маской.
 **/
// Здесь используем интерфейс, а не тип (как подсказывает eslint), чтобы автогенерация документации подхватила его
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMaskFieldProps extends IInputFieldProps {}

function MaskField(props: IMaskFieldProps): JSX.Element {
    return (
        <InputField {...props} />
    );
}

export default MaskField;
