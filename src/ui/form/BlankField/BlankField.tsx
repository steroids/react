import * as React from 'react';

import fieldWrapper, {IFieldWrapperInputProps, IFieldWrapperOutputProps} from '../Field/fieldWrapper';
import {FieldEnum} from '../../../enums';

/**
 * BlankField
 *
 * Пустое поле. Он отображает переданный текст или дочерние элементы.
 *
 * Компонент `BlankField` принимает следующие свойства:
 *
 * - `text`: текст для отображения (тип: string | React.ReactNode)
 * - `children`: дочерние элементы (тип: React.ReactNode)
 * - все остальные свойства являются наследниками интерфейсов `IFieldWrapperInputProps` и `IUiComponent`
 */
export interface IBlankFieldProps extends IFieldWrapperInputProps, IUiComponent {
    /**
    * Текст для отображения
    * @example 'Hello World!'
    */
    text?: string | React.ReactNode,

    /**
     * Дочерние элементы
     */
    children?: React.ReactNode,
}

function BlankField(props: IBlankFieldProps & IFieldWrapperOutputProps): JSX.Element {
    return <span>{props.text || props.children || props.input?.value}</span>;
}

export default fieldWrapper<IBlankFieldProps>(FieldEnum.BLANK, BlankField);
