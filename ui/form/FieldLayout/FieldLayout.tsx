import * as React from 'react';
import {useMemo} from 'react';
import {mergeLayoutProp} from '../../../hoc/form';
import {useComponents} from '../../../hooks';

export interface IFieldLayoutProps {

    /**
     * Название поля либо отмена отображение поля (false)
     * @example Visible
     */
    label?: string | boolean | any;
    hint?: string | boolean;

    /**
     * Обязательное ли поле? Если true,
     * то к названию будет добавлен модификатор 'required' - красная звездочка (по умолчанию)
     * @example true
     */
    required?: boolean;
    layout?: FormLayout;
    errors?: string | string[];
    layoutView?: CustomView;
    [key: string]: any;
}

export interface IFieldLayoutViewProps {
    label: string | boolean | any,
    required: boolean,
    hint: string | boolean,
    errors: string | string[],
    layout?: {
        layout: FormLayoutName | boolean,
        className: string,
        label: boolean,
        cols: number[],
        [key: string]: any,
    },
    children?: React.ReactNode
}

function FieldLayout(props: IFieldLayoutProps) {
    const components = useComponents();
    const FieldLayoutView = props.layoutView || components.ui.getView('form.FieldLayoutView');

    const layout = useMemo(() => mergeLayoutProp(FieldLayout.defaultProps.layout, props.layout), [props.layout]);
    if (layout === false) {
        return props.children;
    }

    return (
        <FieldLayoutView
            {...props}
            layout={layout}
        >
            {props.children}
        </FieldLayoutView>
    );
}

FieldLayout.defaultProps = {
    layout: {
        layout: 'default',
        cols: [3, 6],
    },
    required: false,
    className: '',
};

export default React.memo(FieldLayout);