/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import useBem from '../../../../../src/hooks/useBem';
import Text from '../../../../../src/ui/typography/Text/Text';
import {ButtonGroup} from '../../../../../src/ui/nav';
import {Icon} from '../../../../../src/ui/content';
import DateControlEnum from '../../../../../src/ui/content/CalendarSystem/enums/DateControlType';
import CalendarEnum from '../../../../../src/ui/content/CalendarSystem/enums/CalendarType';
import ButtonGroupMockView from '../../../nav/ButtonGroup/ButtonGroupMockView';

interface IContentHeaderProps {
    dateToDisplay: string;
    onChangeCalendarType: (newType: string) => void;
    handleControlClick: (event: React.MouseEvent<HTMLElement>) => void;
}

function ContentHeader(props: IContentHeaderProps) {
    const bem = useBem('ContentHeader');

    return (
        <div className={bem.block()}>
            <Text
                content={props.dateToDisplay}
                className={bem.element('month')}
            />
            <ul
                className={bem.element('controls')}
                onClick={props.handleControlClick}
            >
                {Object.entries(DateControlEnum.getIcons()).map(([controlLabel, controlIcon], controlIndex) => (
                    <li
                        key={controlIndex}
                        className={bem.element('controls-item')}
                        data-control={controlLabel}
                    >
                        <Icon
                            className={bem.element('controls-item-icon')}
                            name='mockIcon'
                        />
                    </li>
                ))}
            </ul>
            <ButtonGroup
                view={ButtonGroupMockView}
                className={bem.element('measures')}
                items={CalendarEnum}
                onClick={props.onChangeCalendarType}
                defaultActiveButton={CalendarEnum.MONTH}
            />
        </div>
    );
}

export default React.memo(ContentHeader);
