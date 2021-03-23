import * as React from 'react';
import {useMemo} from 'react';
import {useComponents} from '../../../hooks';
import {mergeLayoutProp} from '../../../utils/form';

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

const defaultProps = {
    layout: {
        layout: 'default',
        cols: [3, 6],
    },
};

function FieldLayout(props: IFieldLayoutProps) {
    const components = useComponents();
    const FieldLayoutView = props.layoutView || components.ui.getView('form.FieldLayoutView');

    const layout = useMemo(() => mergeLayoutProp(defaultProps.layout, props.layout), [props.layout]);
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

export default React.memo(FieldLayout);
