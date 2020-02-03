import * as React from 'react';
import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import dataProviderHoc from '../dataProviderHoc';

interface ICheckboxListFieldProps {
    label?: string | boolean;
    hint?: string;
    attribute?: string;
    input?: {
        name?: string,
        value?: any,
        onChange?: (...args: any[]) => any
    };
    required?: boolean;
    isInvalid?: boolean;
    disabled?: boolean;
    inputProps?: any;
    onChange?: (...args: any[]) => any;
    className?: string;
    view?: any;
    items?: {
        id?: number | string | boolean,
        label?: string
    }[];
    onItemClick?: any;
    map?: any;
    getView?: any;
    ui?: any;
    selectedItems?: any;
    hoveredItem?: any;
}

@fieldHoc({
    componentId: 'form.CheckboxListField'
})
@dataProviderHoc()
@components('ui')
export default class CheckboxListField extends React.PureComponent<ICheckboxListFieldProps,
    {}> {
    static defaultProps = {
        disabled: false,
        required: false,
        className: "",
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
