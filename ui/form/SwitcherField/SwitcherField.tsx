import * as React from 'react';
import {components, field} from '../../../hoc';
import dataProvider, {IDataProviderHocInput, IDataProviderHocOutput} from "../../../hoc/dataProvider";
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface ISwitcherFieldProps extends IFieldHocInput, IDataProviderHocInput {
    className?: CssClassName;
    view?: CustomView;
    buttonProps?: any;
    [key: string]: any;
}

export interface ISwitcherFieldViewProps extends IFieldHocOutput, IDataProviderHocOutput {
    items: {
        id: number | string | boolean,
        label?: string,
        isSelected: boolean,
        isHovered: boolean,
    }[];
    onItemClick: (item: {id: number | string | boolean}) => void,
    buttonProps?: any,
}

interface ISwitcherFieldPrivateProps extends IFieldHocOutput, IDataProviderHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.SwitcherField'
})
@dataProvider()
@components('ui')
export default class SwitcherField extends React.PureComponent<ISwitcherFieldProps & ISwitcherFieldPrivateProps> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        errors: []
    };

    render() {
        const SwitcherFieldView =
            this.props.view || this.props.ui.getView('form.SwitcherFieldView');
        return (
            <SwitcherFieldView
                {...this.props}
                items={this.props.items.map(item => ({
                    ...item,
                    isSelected: !!this.props.selectedItems.find(
                        selectedItem => selectedItem.id === item.id
                    ),
                    isHovered:
                        this.props.hoveredItem && this.props.hoveredItem.id === item.id
                }))}
                onItemClick={this.props.onItemClick}
            />
        );
    }
}
