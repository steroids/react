import * as React from 'react';
import {useCallback} from 'react';
import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import Calendar from '../../../../src/ui/content/Calendar';
import DropDown from '../../../../src/ui/content/DropDown';
import {IDateTimeFieldViewProps} from '../../../../src/ui/form/DateTimeField/DateTimeField';
import TimePanelView from '../TimeField/TimePanelMockView';

export default function DateTimeFieldView(props: IDateTimeFieldViewProps) {
    const bem = useBem('DateTimeFieldView');

    const renderContent = useCallback(() => (
        <div className={bem.element('panel-container')}>
            <Calendar
                {...props.calendarProps}
                className={bem.element('calendar')}
            />
            <div className={bem.element('separator')} />
            <TimePanelView
                {...props.timePanelViewProps}
                className={bem.element('time-panel')}
            />
        </div>
    ), [bem, props.calendarProps, props.timePanelViewProps]);

    return (
        <DropDown
            content={renderContent}
            position='bottomLeft'
            visible={props.isOpened}
            onClose={props.onClose}
        >
            <div
                className={bem(
                    bem.block({
                        size: props.size,
                        disabled: props.disabled,
                        'is-invalid': !!props.errors,
                    }),
                    props.className,
                )}
                style={props.style}
            >

                <div className={bem.element('body')}>
                    <input
                        {...props.inputProps}
                        placeholder={props.placeholder
                            ? props.placeholder
                            : props.inputProps.placeholder}
                        className={bem(
                            bem.element('input', {
                                size: props.size,
                            }),
                            props.isInvalid && 'is-invalid',
                        )}
                        onChange={e => props.inputProps.onChange(e.target.value)}
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
