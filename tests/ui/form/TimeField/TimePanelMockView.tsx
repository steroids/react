import _padStart from 'lodash-es/padStart';
import * as React from 'react';

import {useBem} from '../../../../src/hooks';
import {ITimePanelViewProps} from '../../../../src/ui/form/TimeField/TimeField';

const getHours = () => {
    const result = [];
    for (let i = 0; i < 24; i += 1) {
        const hour = _padStart(i, 2, '0');
        result.push(hour);
    }
    return result;
};

const getMinutes = () => {
    const result = [];
    for (let i = 0; i < 60; i += 1) {
        const minute = _padStart(i, 2, '0');
        result.push(minute);
    }
    return result;
};

function TimePanelView(props: ITimePanelViewProps) {
    const bem = useBem('TimePanelView');
    const [hours, minutes] = props.value ? props.value.split(':') : ['00', '00'];
    return (
        <div className={bem(bem.block(), props.className)}>
            {props.showHeader && (
                <div className={bem.element('header')}>
                    {props.value && (
                        `${hours}:${minutes}`
                    )}
                </div>
            )}
            <div className={bem.element('body')}>
                <div className={bem.element('column')}>
                    {getHours().map((value, index) => (
                        <div
                            key={index}
                            className={bem.element('cell', {
                                selected: value === hours,
                            })}
                            onKeyPress={e => {
                                e.preventDefault();
                                props.onSelect(value + ':' + minutes);
                            }}
                            onClick={e => {
                                e.preventDefault();
                                props.onSelect(value + ':' + minutes);
                            }}
                            role='button'
                            tabIndex={0}
                        >
                            <div className={bem.element('cell-value')}>
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={bem.element('column')}>
                    {getMinutes().map((value, index) => (
                        <div
                            key={index}
                            className={bem.element('cell', {
                                selected: value === minutes,
                            })}
                            onKeyPress={e => {
                                e.preventDefault();
                                props.onSelect(hours + ':' + value);
                            }}
                            onClick={e => {
                                e.preventDefault();
                                props.onSelect(hours + ':' + value);
                            }}
                            role='button'
                            tabIndex={0}
                        >
                            <div className={bem.element('cell-value')}>
                                {value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={bem.element('footer', {'to-end': !props.showNow})}>
                {props.showNow && (
                    <button
                        className={bem.element('button', 'now')}
                        onClick={(e) => {
                            e.preventDefault();
                            props.onNow();
                        }}
                    >
                        {__('Текущее')}
                    </button>
                )}
                <button
                    className={bem.element('button', 'ok')}
                    onClick={(e) => {
                        e.preventDefault();
                        props.onClose();
                    }}
                >
                    {__('Ок')}
                </button>
            </div>
        </div>
    );
}

TimePanelView.defaultProps = {
    showHeader: false,
    showNow: true,
};

export default TimePanelView;
