import React from 'react';
import PropTypes from 'prop-types';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import dataProviderHoc from '../dataProviderHoc';

@fieldHoc({
    componentId: 'form.CheckboxListField',
})
@dataProviderHoc()
@components('ui')
export default class CheckboxListField extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
        ]),
        hint: PropTypes.string,
        attribute: PropTypes.string,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        required: PropTypes.bool,
        isInvalid: PropTypes.bool,
        disabled: PropTypes.bool,
        inputProps: PropTypes.object,
        onChange: PropTypes.func,
        className: PropTypes.string,
        view: PropTypes.elementType,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
                PropTypes.bool,
            ]),
            label: PropTypes.string,
        })),
    };

    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        multiple: true,
    };

    render() {
        const CheckboxListFieldView = this.props.view || this.props.ui.getView('form.CheckboxListFieldView');
        return (
            <CheckboxListFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    type: 'checkbox',
                    ...this.props.inputProps,
                    disabled: this.props.disabled,
                }}
                items={this.props.items.map(item => ({
                    ...item,
                    isSelected: !!this.props.selectedItems.find(selectedItem => selectedItem.id === item.id),
                    isHovered: this.props.hoveredItem && this.props.hoveredItem.id === item.id,
                }))}
                onItemClick={this.props.onItemClick}
            />
        );
    }

}
