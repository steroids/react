import * as React from 'react';
import {useCallback} from 'react';
import {IDateFieldViewProps} from '../../../../src/ui/form/DateField/DateField';
import Icon from '../../../../src/ui/content/Icon';
import {useBem} from '../../../../src/hooks';
import DropDown from '../../../../src/ui/content/DropDown';
import Calendar from '../../../../src/ui/content/Calendar';

export default function DateFieldView(props: IDateFieldViewProps) {
    const bem = useBem('DateFieldView');

    const renderCalendar = useCallback(() => (
        <Calendar {...props.calendarProps} />
    ), [props.calendarProps]);

    return (
        <DropDown
            content={renderCalendar}
            position='bottomLeft'
            visible={props.isOpened}
            onClose={props.onClose}
        >
            <div
                className={bem(
                    bem.block({
                        size: props.size,
                        disabled: props.disabled,
                        'has-icon': !!props.icon,
                    }),
                    props.className,
                )}
                style={props.style}
            >
                <div className={bem.element('body')}>
                    <input
                        {...props.inputProps}
                        onChange={e => props.inputProps.onChange(e.target.value)}
                        className={bem(
                            bem.element('input'),
                            props.isInvalid && 'is-invalid',
                            props.inputProps.className,
                        )}
                    />
                    <div className={bem.element('icon-container')}>
                        {!props.inputProps.value && props.icon && (
                            <Icon
                                className={bem.element('date-icon')}
                                name="mockIcon"
                                tabIndex={-1}
                            />
                        )}
                        {props.showRemove && props.inputProps.value && (
                            <Icon
                                className={bem.element('close-icon')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (props.onClear) {
                                        props.onClear();
                                    }
                                }}
                                name="mockIcon"
                            />
                        )}
                    </div>
                </div>
            </div>
        </DropDown>
    );
}