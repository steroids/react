import React from 'react';
import CheckboxField, {ICheckboxFieldProps} from '../CheckboxField/CheckboxField';

/**
 * RadioField
 *
 * Компонент RadioField представляет собой элемент выбора типа "radio". Он позволяет пользователю выбрать один вариант из нескольких предложенных.
 **/
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRadioFieldProps extends ICheckboxFieldProps {
    // Этот интерфейс оставлен для будущего расширения и генерации документации
}

function RadioField(props: IRadioFieldProps): JSX.Element {
    return (
        <CheckboxField
            multiply={false}
            view="form.RadioFieldView"
            {...props}
        />
    );
}

export default RadioField;
