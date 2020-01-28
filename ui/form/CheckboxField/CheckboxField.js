import React from 'react';
import PropTypes from 'prop-types';

import {components} from '../../../hoc';
import fieldHoc from '../fieldHoc';

@fieldHoc({
    componentId: 'form.CheckboxField',
    layoutProps: {
        label: false,
    }
})
@components('ui')
export default class CheckboxField extends React.PureComponent {

    static propTypes = {
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.any,
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
    };

    static defaultProps = {
        disabled: false,
        required: false,
        className: '',
    };

    componentDidMount() {
        if (this.props.input.value === undefined) {
            this.props.dispatch(this.props.input.onChange(false));
        }
    }

    render() {
        const CheckboxFieldView = this.props.view || this.props.ui.getView('form.CheckboxFieldView');
        return (
            <CheckboxFieldView
                {...this.props}
                inputProps={{
                    name: this.props.input.name,
                    type: 'checkbox',
                    checked: !!this.props.input.value,
                    onChange: () => this.props.input.onChange(!this.props.input.value),
                    disabled: this.props.disabled,
                    ...this.props.inputProps,
                }}
            />
        );
    }

}
