import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';
import {mergeLayoutProp} from '../../../hoc/form';

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
    };
}

interface IFieldLayoutPrivateProps extends IComponentsHocOutput {

}

const defaultProps = {
    layout: {
        layout: 'default',
        cols: [3, 6]
    },
    required: false,
    className: ''
};

@components('ui')
export default class FieldLayout extends React.PureComponent<IFieldLayoutProps & IFieldLayoutPrivateProps> {
    static defaultProps = defaultProps;

    render() {
        if (this.props.layout === false) {
            return this.props.children;
        }
        const FieldLayoutView = this.props.layoutView || this.props.ui.getView('form.FieldLayoutView');
        const layout = mergeLayoutProp(defaultProps.layout, this.props.layout);
        return (
            <FieldLayoutView
                {...this.props}
                layout={typeof layout === 'object' ? layout : {layout}}
            >
                {this.props.children}
            </FieldLayoutView>
        );
    }
}
