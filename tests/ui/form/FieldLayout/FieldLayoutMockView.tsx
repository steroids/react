import _isEmpty from 'lodash-es/isEmpty';
import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import {IFieldLayoutViewProps} from '../../../../src/ui/form/FieldLayout/FieldLayout';
import IconMockView from '../../content/Icon/IconMockView';

export default function FieldLayoutView(props: IFieldLayoutViewProps) {
    const bem = useBem('FieldLayoutView');

    return (
        <div className={bem.block()}>
            {props.label && (
                <label
                    htmlFor={props.id}
                    className={bem.element('label', {
                        required: props.required,
                        size: props.size,
                    })}
                >
                    {props.label + ':'}
                </label>
            )}
            <div className={bem.element('field')}>
                {props.children}
                {!_isEmpty(props.errors) && (
                    <div className={bem.element('invalid-feedback')}>
                        {props.errors.filter(error => typeof error === 'string').map((error, index) => (
                            <div
                                key={index}
                                className={bem.element('error-message')}
                            >
                                <Icon
                                    view={IconMockView}
                                    name="mockIcon"
                                    className={bem.element('icon_error')}
                                    tabIndex={-1}
                                />
                                <span className={bem.element(
'error-text',
                                    {
                                        size: props.size || 'md',
                                    },
)}
                                >
                                    {error}

                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {_isEmpty(props.errors) && props.hint && (
                    <div className={bem.element('hint', {size: props.size})}>
                        {props.hint}
                    </div>
                )}
            </div>
        </div>
    );
}
