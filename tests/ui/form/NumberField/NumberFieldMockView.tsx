import _isNumber from 'lodash-es/isNumber';

import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import {INumberFieldViewProps} from '../../../../src/ui/form/NumberField/NumberField';
import IconMockView from '../../content/Icon/IconMockView';

export default function NumberFieldView(props: INumberFieldViewProps) {
    const bem = useBem('NumberFieldView');

    return (
        <div
            className={bem(
                bem.block({
                    disabled: props.inputProps.disabled,
                    size: props.size,
                    hasErrors: !!props.errors,
                    filled: !!props.inputRef?.current?.value,
                }),
                props.className,
            )}
        >
            <input
                ref={props.inputRef}
                className={bem(
                    bem.element('input', {
                        hasErrors: !!props.errors,
                    }),
                )}
                {...props.inputProps}
                onWheel={event => event.currentTarget.blur()}
                id={props.id}
                onBlur={props.onBlur}
            />
            {!props.disabled && !props.errors && (
                <div className={bem.element('arrows-container')}>
                    <button
                        className={bem.element('arrow', {
                            disabled: _isNumber(props.inputProps.max) && props.inputProps.value >= props.inputProps.max,
                        })}
                        type='button'
                        onClick={props.onStepUp}
                    >
                        <Icon
                            view={IconMockView}
                            name='mockIcon'
                        />
                    </button>
                    <button
                        className={bem.element('arrow', {
                            disabled: _isNumber(props.inputProps.min) && props.inputProps.value <= props.inputProps.min,
                        })}
                        type='button'
                        onClick={props.onStepDown}
                    >
                        <Icon
                            view={IconMockView}
                            name='mockIcon'
                        />
                    </button>
                </div>
            )}
            <span className={bem.element('input-effects')} />
        </div>
    );
}
