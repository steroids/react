import _isFunction from 'lodash-es/isFunction';
import _isString from 'lodash-es/isString';
import * as React from 'react';
import {useContext, useMemo} from 'react';

import {IFieldWrapperInputProps} from './fieldWrapper';
import {Model, ModelAttribute} from '../../../components/MetaComponent';
import {FieldEnum} from '../../../enums';
import {useComponents} from '../../../hooks';
import {FormContext} from '../Form/Form';

/**
 * Field
 *
 * Компонент, который рендерит соответствующее поле, исходя из переданной модели и названия атрибута.
 * По умолчанию будет отрендерен InputField.
 * Также можно не использовать модель, а передавать компонент поля напрямую через пропсы.
 */
export interface IFieldProps extends IFieldWrapperInputProps {
    /**
     * Аттрибут (название) поля в форме
     * @example isVisible
     */
    attribute?: string,

    /**
     * Модель с полями формы
     * @example
     * {
     *  attributes: [
     *   {
     *    attribute: 'category',
     *    field: 'DropDownField'
     *   }
     *  ]
     * }
     */
    model?: Model,

    /**
     * Компонент поля
     * @example DropDownField
     */
    component?: any,

    [key: string]: any,
}

function Field(props: IFieldProps): JSX.Element {
    const components = useComponents();

    // Get model
    const context = useContext(FormContext);
    const fieldModel = useMemo(() => {
        const model = props.model || context.model;
        const modelAttributes = (components.meta.getModel(model)?.attributes || model?.attributes || []) as ModelAttribute[];
        const result = modelAttributes
            .find(field => field.attribute === props.attribute);

        return result || {};
    }, [components, props.model, context.model, props.attribute]);

    const component = props.component
        || fieldModel.searchField
        || fieldModel.field
        || FieldEnum.INPUT_FIELD;

    const ComponentField = _isString(component)
        ? components.ui.getField(`form.${component}`)
        : component;

    const viewProps = useMemo(() => ({
        ...fieldModel,
        ...props,
        ...fieldModel.fieldProps,
        ...fieldModel.searchFieldProps,
    }), [fieldModel, props]);

    // Render
    return _isFunction(ComponentField)
        ? ComponentField(viewProps)
        : <ComponentField {...viewProps} />;
}

export default React.memo(Field);
