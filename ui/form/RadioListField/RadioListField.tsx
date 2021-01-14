import * as React from 'react';
import {components, field} from '../../../hoc';
import dataProvider, {IDataProviderHocInput, IDataProviderHocOutput} from "../../../hoc/dataProvider";
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface IRadioListFieldProps extends IFieldHocInput, IDataProviderHocInput {
    inputProps?: any;
    className?: CssClassName;
    view?: CustomView;
    [key: string]: any;
}

export interface IRadioListFieldViewProps extends IFieldHocOutput, IDataProviderHocOutput {
    inputProps: {
        type: string,
        name: string,
        disabled: string,
    },
    items: {
        id: number | string | boolean,
        label?: string,
        isSelected: boolean,
        isHovered: boolean,
    }[];
    onItemClick: (item: {id: number | string | boolean}) => void,
}

interface IRadioListFieldPrivateProps extends IFieldHocOutput, IDataProviderHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.RadioListField'
})
@dataProvider()
@components('ui')
export default class RadioListField extends React.PureComponent<IRadioListFieldProps & IRadioListFieldPrivateProps> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        errors: []
    };

    render() {
        const RadioListFieldView =
            this.props.view || this.props.ui.getView('form.RadioListFieldView');
        return (
            <RadioListFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    type: 'radio',
                    ...this.props.inputProps,
                    disabled: this.props.disabled
                }}
                items={this.props.items.map(item => ({
                    ...item,
                    isSelected: !!this.props.selectedItems.find(
                        selectedItem => selectedItem.id === item.id
                    ),
                    isHovered: this.props.hoveredItem && this.props.hoveredItem.id === item.id
                }))}
                onItemClick={this.props.onItemClick}
            />
        );
    }
}
