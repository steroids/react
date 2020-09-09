import * as React from 'react';
import {SubmissionError} from 'redux-form';
import _isUndefined from 'lodash-es/isUndefined';
import _set from 'lodash-es/set';
import _get from 'lodash-es/get';
import _isPlainObject from 'lodash-es/isPlainObject';
import _isArray from 'lodash-es/isArray';
import components from './components';
import {IComponentsHocOutput} from './components';
import validate from "../ui/form/validate";

/**
 * Form Submit HOC
 * Используется в `Form` для добавления обработчика `onSubmit`
 */
export interface IFormSubmitHocInput {
    action?: any,
    actionMethod?: string,
    autoSave?: any,
    validators?: any,
    onBeforeSubmit?: any,
    onSubmit?: any,
    onAfterSubmit?: any,
    onComplete?: any,
}

export interface IFormSubmitHocOutput {

}

interface IFormSubmitHocPrivateProps extends IComponentsHocOutput {
    formRegisteredFields?: any,
    formId?: string,
}

export default (): any => WrappedComponent =>
    components('http', 'clientStorage')(
        class FormSubmitHoc extends React.PureComponent<IFormSubmitHocInput & IFormSubmitHocPrivateProps> {
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

            cleanEmptyObject(object) {
                // if all properties are null substitute the object with null
                if (!Object.values(object).some(x => x)) {
                    return null;
                }

                Object.keys(object).forEach(key => {
                    if (_isPlainObject(object[key])) {
                        object[key] = this.cleanEmptyObject(object[key]);
                    }

                    if (_isArray(object[key])) {
                        let array = object[key];

                        array.forEach((value, index) => {
                            if (_isPlainObject(value)) {
                                array[index] = this.cleanEmptyObject(value);
                            }
                        });

                        if (!object[key].some(x => Boolean(x))) {
                            object[key] = [];
                        }
                    }
                });

                return object;
            }

            _onSubmit(values) {
                // Append non touched fields to values object
                Object.keys(this.props.formRegisteredFields || {}).forEach(key => {
                    const name = this.props.formRegisteredFields[key].name;
                    if (_isUndefined(_get(values, name))) {
                        _set(values, name, null);
                    }
                });
                values = this.cleanEmptyObject(values);

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

                            const AutoSaveHelper = require('../ui/form/Form/AutoSaveHelper').default;
                            AutoSaveHelper.remove(this.props.clientStorage, this.props.formId);
                        }
                    });
            }
        }
    )
