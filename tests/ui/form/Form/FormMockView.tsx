import _isString from 'lodash-es/isString';
import * as React from 'react';
import {useRef} from 'react';
import {useMount} from 'react-use';

import {useBem} from '../../../../src/hooks';
import Button from '../../../../src/ui/form/Button';
import Field from '../../../../src/ui/form/Field';
import {IFormViewProps} from '../../../../src/ui/form/Form/Form';

function FormView(props: IFormViewProps) {
    const bem = useBem('FormView');
    const formRef = useRef(null);

    // Auto focus
    useMount(() => {
        if (props.autoFocus) {
            const inputEl = formRef.current.querySelector('input:not([type=hidden])');
            setTimeout(() => {
                if (inputEl && inputEl.focus) {
                    inputEl.focus();
                }
            }, 10);
        }
    });

    return (
        <form
            ref={formRef}
            className={bem(
                bem.block(),
                props.className,
            )}
            onSubmit={props.onSubmit}
            style={props.style}
        >
            {props.children}
            {(props.fields || []).map((field: any, index) => (
                <Field
                    key={index}
                    {...(_isString(field) ? {attribute: field} : field)}
                />
            ))}
            {props.submitLabel && (
                <Button
                    type='submit'
                    label={props.submitLabel}
                />
            )}
        </form>
    );
}

export default React.memo(FormView);
