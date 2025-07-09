import * as React from 'react';
import {useCallback} from 'react';
import _isString from 'lodash-es/isString';
import {useBem} from '../../../../src/hooks';
import Icon from '../../../../src/ui/content/Icon';
import DropDown from '../../../../src/ui/content/DropDown';
import Calendar from '../../../../src/ui/content/Calendar';
import {IDateTimeRangeFieldViewProps} from '../../../../src/ui/form/DateTimeRangeField/DateTimeRangeField';
import TimePanelView from '../TimeField/TimePanelMockView';

export default function DateTimeRangeFieldView(props: IDateTimeRangeFieldViewProps) {
    const bem = useBem('DateTimeRangeFieldView');

    const hasValue = props.inputPropsFrom?.value || props.inputPropsTo?.value;

    const renderCalendar = useCallback(() => (
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
            content={renderCalendar}
            position='bottomLeft'
            visible={props.isOpened}
            onClose={props.onClose}
        >
            <div
                className={bem(
bem.block({
                    disabled: props.disabled,
                    size: props.size,
                    'is-invalid': !!props.errors,
                }),
                    props.className,
)}
                style={props.style}
            >
                <div className={bem.element('body')}>
                    <input
                        {...props.inputPropsFrom}
                        className={bem(
                            bem.element('input', {
                                size: props.size,
                            }),
                        )}
                        onChange={e => props.inputPropsFrom.onChange(e.target.value)}
                    />
                    <input
                        {...props.inputPropsTo}
                        className={bem(
                            bem.element('input', {
                                size: props.size,
                            }),
                            !!props.errorsTo && 'is-invalid',
                        )}
                        onChange={e => props.inputPropsTo.onChange(e.target.value)}
                    />
                    <div className={bem.element('icon-container')}>
                        {props.icon && !hasValue && (
                            <Icon
                                className={bem.element('date-icon')}
                                name="mockIcon"
                                tabIndex={-1}
                            />
                        )}
                        {props.showRemove && hasValue && (
                            <Icon
                                className={bem.element('close-icon')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (props.onClear) {
                                        props.onClear();
                                    }
                                }}
                                name='mockIcon'
                            />
                        )}
                    </div>
                    <span className={bem.element('effect')} />
                </div>
            </div>
        </DropDown>
    );
}
