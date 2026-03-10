import _isString from 'lodash-es/isString';
import * as React from 'react';
import {useCallback} from 'react';

import {useBem} from '../../../../src/hooks';
import Calendar from '../../../../src/ui/content/Calendar';
import DropDown from '../../../../src/ui/content/DropDown';
import Icon from '../../../../src/ui/content/Icon';
import {IDateRangeFieldViewProps} from '../../../../src/ui/form/DateRangeField/DateRangeField';

export default function DateRangeFieldView(props: IDateRangeFieldViewProps) {
    const bem = useBem('DateRangeFieldView');

    const hasValue = props.inputPropsFrom?.value || props.inputPropsTo?.value;

    const renderCalendar = useCallback(() => (
        <Calendar
            {...props.calendarProps}
        />
    ), [props.calendarProps]);
    return (
        <DropDown
            content={renderCalendar}
            position='bottomLeft'
            visible={props.isOpened}
            onClose={props.onClose}
            className={bem.element('split')}
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
                            }),
                        )}
                        placeholder={props.inputPropsFrom?.placeholder}
                        onChange={e => props.inputPropsFrom.onChange(e.target.value)}
                    />
                    <input
                        {...props.inputPropsTo}
                        className={bem(
                            bem.element('input', {
                            }),
                        )}
                        onChange={e => props.inputPropsTo.onChange(e.target.value)}
                    />
                    <div className={bem.element('icon-container')}>
                        {props.icon && !hasValue && (
                            <Icon
                                className={bem.element('date-icon')}
                                name='mockIcon'
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
