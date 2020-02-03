import * as React from 'react';
import {SubmissionError} from 'redux-form';
import _isUndefined from 'lodash-es/isUndefined';
import _set from 'lodash-es/set';
import _get from 'lodash-es/get';
import {components} from '../../hoc';
import AutoSaveHelper from './Form/AutoSaveHelper';
import validate from './validate';
import {IComponentsContext} from '../../hoc/components';

interface IFormSubmitHocProps extends IComponentsContext {
    actionMethod?: string,
    formRegisteredFields?: any,
    onBeforeSubmit?: any,
    validators?: any,
    onSubmit?: any,
    onAfterSubmit?: any,
    onComplete?: any,
    action?: any,
    autoSave?: any,
    formId?: string,
}

export default (): any => WrappedComponent =>
    components('http', 'clientStorage')(
        class FormSubmitHoc extends React.PureComponent<IFormSubmitHocProps> {
            static WrappedComponent = WrappedComponent;
            /**
             * Proxy real name, prop types and default props for storybook
             */
            static displayName = WrappedComponent.displayName || WrappedComponent.name;
            static propTypes = WrappedComponent.propTypes;
            static defaultProps = {
                ...WrappedComponent.defaultProps,
                actionMethod: 'POST'
            };

            constructor(props) {
                super(props);
                this._onSubmit = this._onSubmit.bind(this);
            }

            render() {
                return <WrappedComponent {...this.props} onSubmit={this._onSubmit}/>;
            }

            _onSubmit(values) {
                // Append non touched fields to values object
                Object.keys(this.props.formRegisteredFields || {}).forEach(key => {
                    const name = this.props.formRegisteredFields[key].name;
                    if (_isUndefined(_get(values, name))) {
                        _set(values, name, null);
                    }
                });
                // Event onBeforeSubmit
                if (
                    this.props.onBeforeSubmit &&
                    this.props.onBeforeSubmit(values) === false
                ) {
                    return;
                }
                if (this.props.validators) {
                    validate(values, this.props.validators);
                }
                if (this.props.onSubmit) {
                    return this.props.onSubmit(values);
                }
                return this.props.http
                    .send(
                        this.props.actionMethod,
                        this.props.action || location.pathname,
                        values
                    )
                    .then(response => {
                        const data = response.data || {};
                        // Event onAfterSubmit
                        if (
                            this.props.onAfterSubmit &&
                            this.props.onAfterSubmit(values, data, response) === false
                        ) {
                            return;
                        }
                        if (data.errors) {
                            throw new SubmissionError(data.errors);
                        }
                        if (this.props.onComplete) {
                            this.props.onComplete(values, data, response);
                        }
                        if (this.props.autoSave) {
                            AutoSaveHelper.remove(this.props.clientStorage, this.props.formId);
                        }
                    });
            }
        }
    )
