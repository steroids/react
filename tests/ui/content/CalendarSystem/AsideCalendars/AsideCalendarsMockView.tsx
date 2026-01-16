import React, {memo} from 'react';

import useBem from '../../../../../src/hooks/useBem';
import {Accordion, AccordionItem, Icon} from '../../../../../src/ui/content';
import {IEventGroup} from '../../../../../src/ui/content/CalendarSystem/CalendarSystem';
import {CheckboxListField, Button} from '../../../../../src/ui/form';

interface IAsideCalendarsProps {
    eventGroups: IEventGroup[],
    eventGroupsTitle: string,
    onChangeEventGroupsIds: (selectedIds: number[]) => void,
    openCreateEventGroupModal: () => void,
}

function AsideCalendars(props: IAsideCalendarsProps) {
    const bem = useBem('AsideCalendars');

    return (
        <div className={bem.block()}>
            <Accordion>
                <AccordionItem title={props.eventGroupsTitle}>
                    <CheckboxListField
                        items={props.eventGroups}
                        onChange={(selectedIds) => props.onChangeEventGroupsIds(selectedIds)}
                    />
                    <Button
                        color='basic'
                        className={bem.element('add')}
                        onClick={props.openCreateEventGroupModal}
                        size='sm'
                    >
                        <Icon name="mockIcon" />
                    </Button>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default memo(AsideCalendars);
