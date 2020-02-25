import * as React from 'react';
import {components} from '../../../hoc';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IFieldLayoutProps {
    label?: string | boolean | any;
    hint?: string | boolean;
    required?: boolean;
    layout?: ('default' | 'inline' | 'horizontal') | string | boolean;
    layoutProps?: any;
    size?: Size;
    errors?: string | string[];
    layoutClassName?: string;
    layoutView?: any;
}

export interface IFieldLayoutViewProps {
    layoutProps?: any;
}

interface IFieldLayoutPrivateProps extends IComponentsHocOutput {

}

const defaultProps = {
    layout: 'default',
    layoutProps: {
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
        const FieldLayoutView =
            this.props.layoutView || this.props.ui.getView('form.FieldLayoutView');
        return (
            <FieldLayoutView
                {...this.props}
                layoutProps={{
                    ...defaultProps.layoutProps,
                    ...this.props.layoutProps
                }}
            >
                {this.props.children}
            </FieldLayoutView>
        );
    }
}
