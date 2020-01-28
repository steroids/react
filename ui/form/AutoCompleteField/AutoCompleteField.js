import React from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import _get from 'lodash/get';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';
import dataProviderHoc from '../dataProviderHoc';
import {props} from '../../../hoc';

@fieldHoc({
    componentId: 'form.AutoCompleteField',
})
@props({
    autoComplete: true,
})
@dataProviderHoc()
@enhanceWithClickOutside
@components('ui')
export default class AutoCompleteField extends React.PureComponent {

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
        placeholder: PropTypes.string,
        isInvalid: PropTypes.bool,
        searchPlaceholder: PropTypes.string,
        disabled: PropTypes.bool,
        inputProps: PropTypes.object,
        onChange: PropTypes.func,
        className: PropTypes.string,
        view: PropTypes.elementType,
        showReset: PropTypes.bool,
        multiple: PropTypes.bool,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
                PropTypes.bool,
            ]),
            label: PropTypes.string,
        })),
        selectedItems: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
                PropTypes.bool,
            ]),
            label: PropTypes.string,
        })),
        hoveredItem: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
                PropTypes.bool,
            ]),
            label: PropTypes.string,
        }),
        autoComplete: PropTypes.bool,
        autoCompleteMinLength: PropTypes.number,
        autoCompleteDelay: PropTypes.number,
        isOpened: PropTypes.bool,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onSearch: PropTypes.func,
        onItemClick: PropTypes.func,
        onItemMouseOver: PropTypes.func,
    };

    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        autoComplete: false,
        showReset: false,
        multiple: false,
    };

    constructor() {
        super(...arguments);

        this._onChange = this._onChange.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
    }

    handleClickOutside() {
        this.props.onClose();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (_get(this.props, 'input.value') !== _get(nextProps, 'input.value')) {
            this.props.onSearch(nextProps.input.value);
        }
    }

    render() {
        const AutoCompleteFieldView = this.props.view || this.props.ui.getView('form.AutoCompleteFieldView');
        return (
            <AutoCompleteFieldView
                {...this.props}
                inputProps={{
                    type: 'text',
                    ...this.props.inputProps,
                    name: this.props.input.name,
                    onChange: this._onChange,
                    onFocus: this._onFocus,
                    onBlur: this._onBlur,
                    value: this.props.input.value || '',
                }}
                items={this.props.items.map(item => ({
                    ...item,
                    isSelected: !!this.props.selectedItems.find(selectedItem => selectedItem.id === item.id),
                    isHovered: this.props.hoveredItem && this.props.hoveredItem.id === item.id,
                }))}
                selectedItems={this.props.selectedItems}
                isOpened={this.props.isOpened && this.props.items.length > 0}
                onItemClick={this.props.onItemClick}
                onItemMouseOver={this.props.onItemMouseOver}
            />
        );
    }

    _onChange(e) {
        if (!this.props.isOpened) {
            this.props.onOpen();
        }
        this.props.input.onChange(e.target.value);
    }

    _onFocus(e) {
        this.props.onOpen();
        if (this.props.inputProps && this.props.inputProps.onFocus) {
            this.props.inputProps.onFocus(e);
        }
    }

    _onBlur(e) {
        setTimeout(() => {
            if (this.props.isOpened) {
                this.props.onClose();
            }
        }, 200);
        if (this.props.inputProps && this.props.inputProps.onBlur) {
            this.props.inputProps.onBlur(e);
        }
    }


}
