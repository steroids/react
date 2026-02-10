import React from 'react';
import CheckboxField, {ICheckboxFieldProps} from '../CheckboxField/CheckboxField';

/**
 * SwitcherField
 *
 * Компонент SwitcherField представляет собой переключатель (switch/toggle),
 * который позволяет пользователю включать или выключать значение (boolean).
 * Обычно используется для управления настройками, параметрами или состояниями
 * «вкл / выкл».
 **/
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISwitcherFieldProps extends ICheckboxFieldProps {
    // Этот интерфейс оставлен для будущего расширения и генерации документации
}

export default function SwitcherField(props: ISwitcherFieldProps) {
    return (
        <CheckboxField
            view='form.SwitcherFieldView'
            {...props}
        />
    );
}
