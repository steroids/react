import * as React from 'react';
import {useCallback} from 'react';
import {useBem} from '../../../../src/hooks';

import {ITimeFieldViewProps} from '../../../../src/ui/form/TimeField/TimeField';
import Icon from '../../../../src/ui/content/Icon';
import DropDown from '../../../../src/ui/content/DropDown';
import TimePanelView from './TimePanelMockView';

export default function TimeFieldView(props: ITimeFieldViewProps) {
    const bem = useBem('TimeFieldView');

    const renderContent = useCallback(() => (
        <TimePanelView {...props.timePanelViewProps} />
    ), [props.timePanelViewProps]);

    const renderBody = () => (
        <div
            className={bem(
                bem.block({
                    disabled: props.disabled,
                    'no-border': props.noBorder,
                }),
                props.className,
            )}
        >
            <div className={bem.element('body')}>
                <input
                    {...props.inputProps}
                    className={bem(
                        bem.element('input'),
                        !!props.errors && 'is-invalid',
                    )}
                    onChange={e => props.inputProps.onChange(e.target.value)}
                />
                <div className={bem.element('icon-container')}>
                    <Icon
                        className={bem.element('icon')}
                        name='clock'
                    />
                    {props.showRemove && props.inputProps.value && props.icon !== false && (
                        <Icon
                            className={bem.element('icon', 'close')}
                            onClick={(e) => {
                                e.preventDefault();
                                props.onClear();
                            }}
                            name={typeof props.icon === 'string' ? props.icon : 'times-circle'}
                        />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <DropDown
            position='bottomLeft'
            content={renderContent}
            visible={props.isOpened}
            onClose={props.onClose}
        >
            {renderBody()}
        </DropDown>
    );
}
