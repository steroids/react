import * as React from 'react';
import {components, field} from '../../../hoc';
import dataProvider, {IDataProviderHocInput, IDataProviderHocOutput} from "../../../hoc/dataProvider";
import {IFieldHocInput, IFieldHocOutput} from '../../../hoc/field';
import {IComponentsHocOutput} from '../../../hoc/components';

export interface ICheckboxListFieldProps extends IFieldHocInput, IDataProviderHocInput {

    /**
     * Свойства для элемента <input />
     * @example {onKeyDown: ...}
     */
    inputProps?: any;

    className?: CssClassName;

    view?: CustomView;
}

export interface ICheckboxListFieldViewProps extends IFieldHocOutput, IDataProviderHocOutput {
    inputProps: {
        name: string,
        type: string,
        disabled?: boolean,
    },
    items: {
        id: number | string | boolean,
        label?: string,
        isSelected: boolean,
        isHovered: boolean,
    }[];
    onItemClick: (item: {id: number | string | boolean}) => void,
}

interface ICheckboxListFieldPrivateProps extends IFieldHocOutput, IDataProviderHocOutput, IComponentsHocOutput {

}

@field({
    componentId: 'form.CheckboxListField'
})
@dataProvider()
@components('ui')
export default class CheckboxListField extends React.PureComponent<ICheckboxListFieldProps & ICheckboxListFieldPrivateProps> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        multiple: true
    };

    render() {
        const CheckboxListFieldView =
            this.props.view || this.props.ui.getView('form.CheckboxListFieldView');
        return (
            <CheckboxListFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    type: 'checkbox',
                    ...this.props.inputProps,
                    disabled: this.props.disabled
                }}
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
