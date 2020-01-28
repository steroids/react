import React from 'react';
import PropTypes from 'prop-types';
import {submit} from 'redux-form';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

@fieldHoc({
    componentId: 'form.TextField',
})
@components('ui')
export default class TextField extends React.PureComponent {

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
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        placeholder: PropTypes.string,
        isInvalid: PropTypes.bool,
        disabled: PropTypes.bool,
        submitOnEnter: PropTypes.bool,
        inputProps: PropTypes.object,
        onChange: PropTypes.func,
        className: PropTypes.string,
        view: PropTypes.elementType,
    };

    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
        placeholder: '',
        submitOnEnter: false,
        errors: [], //for storybook
    };

    constructor() {
        super(...arguments);

        this._onKeyUp = this._onKeyUp.bind(this);
    }

    render() {
        const TextFieldView = this.props.view || this.props.ui.getView('form.TextFieldView');
        return (
            <TextFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    value: this.props.input.value || '',
                    onChange: e => this.props.input.onChange(e.target.value),
                    onKeyUp: this._onKeyUp,
                    placeholder: this.props.placeholder,
                    disabled: this.props.disabled,
                    ...this.props.inputProps,
                }}
            />
        );
    }

    _onKeyUp(e) {
        if (this.props.submitOnEnter && this.props.formId && e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();

            // TODO This is not worked in redux... =(
            this.props.dispatch(submit(this.props.formId));
        }
    }

}
