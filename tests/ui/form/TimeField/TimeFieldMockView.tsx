import {useCallback} from 'react';
import {useBem} from '../../../../src/hooks';

import {ITimeFieldViewProps} from '../../../../src/ui/form/TimeField/TimeField';
import Icon from '../../../../src/ui/content/Icon';
import DropDown from '../../../../src/ui/content/DropDown';
import TimePanelView from './TimePanelMockView';

export default function TimeFieldView(props: ITimeFieldViewProps) {
    const bem = useBem('TimeFieldView');

    const renderContent = useCallback(() => (
        <div className={bem.element('panel-container')}>
            <TimePanelView {...props.timePanelViewProps} />
        </div>
    ), [bem, props.timePanelViewProps]);

    return (
        <DropDown
            position='bottomLeft'
            content={renderContent}
            visible={props.isOpened}
            onClose={props.onClose}
            className={bem.element('dropdown')}
            hasArrow={false}
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
                        className={bem(
                            bem.element('input'),
                            props.inputProps.className,

                        )}
                        onChange={e => props.inputProps.onChange(e.target.value)}
                    />
                    <div className={bem.element('icon-container')}>
                        {!props.inputProps.value && props.icon && (
                            <Icon
                                className={bem.element('date-icon')}
                                name={typeof props.icon === 'string' ? props.icon : 'calendar_range'}
                                tabIndex={-1}
                            />
                        )}
                        {props.showRemove && props.inputProps.value && props.icon !== false && (
                            <Icon
                                className={bem.element('close-icon')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (props.onClear) {
                                        props.onClear();
                                    }
                                }}
                                name='cross_8x8'
                            />
                        )}
                    </div>
                </div>
            </div>
        </DropDown>
    );
}
