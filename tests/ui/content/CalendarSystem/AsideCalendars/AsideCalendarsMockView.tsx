import React, {memo} from 'react';
import useBem from '../../../../../src/hooks/useBem';
import {Accordion, AccordionItem} from '../../../../../src/ui/content';
import {CheckboxListField} from '../../../../../src/ui/form';
import {IEventGroup} from '../../../../../src/ui/content/CalendarSystem/CalendarSystem';

interface IAsideCalendarsProps {
    eventGroups: IEventGroup[]
    eventGroupsTitle: string;
    selectedCalendarGroupsIds: number[],
    onChangeEventGroupsIds: (selectedIds: number[]) => void,
}

function AsideCalendars(props: IAsideCalendarsProps) {
    const bem = useBem('AsideCalendars');

    return (
        <div className={bem.block()}>
            <Accordion>
                <AccordionItem title={props.eventGroupsTitle}>
                    <CheckboxListField
                        items={props.eventGroups}
                        selectedIds={props.selectedCalendarGroupsIds}
                        onChange={(selectedIds) => props.onChangeEventGroupsIds(selectedIds)}
                    />
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default memo(AsideCalendars);
