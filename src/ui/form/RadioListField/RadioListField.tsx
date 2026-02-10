import React from 'react';

import CheckboxListField, {ICheckboxListFieldProps} from '../CheckboxListField/CheckboxListField';

/**
 * RadioListField
 *
 * Список с радиокнопками. Используется в формах для выбора одного значения.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRadioListFieldProps extends ICheckboxListFieldProps {
    // Этот интерфейс оставлен для будущего расширения и генерации документации
}

function RadioListField(props: IRadioListFieldProps): JSX.Element {
    return (
        <CheckboxListField
            multiple={false}
            view='form.RadioListFieldView'
            {...props}
        />
    );
}

export default RadioListField;
