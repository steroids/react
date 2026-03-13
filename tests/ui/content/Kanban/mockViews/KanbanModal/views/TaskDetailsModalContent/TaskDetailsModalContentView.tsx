import * as React from 'react';

import {Avatar, Badge} from '../../../../../../../../src/ui/content';
import {IKanbanTaskDetailsModalViewProps, ITaskTag} from '../../../../../../../../src/ui/content/Kanban/Kanban';
import KanbanPrioritiesEnum from '../../../../../../../../src/ui/content/Kanban/enums/KanbanPrioritiesEnum';
import {Text} from '../../../../../../../../src/ui/typography';

export default function TaskDetailsModalContentView(props: IKanbanTaskDetailsModalViewProps) {
    const {tags, priority, description, assigner} = props.task;

    const toTags = React.useCallback((tag: ITaskTag) => (
        <Badge
            key={tag.id}
            size="md"
            roundingStyle="squarer"
            message={tag.message}
            type={tag.type}
        />
    ), []);

    const priorityLabel = React.useMemo(
        () => KanbanPrioritiesEnum.getLabel(priority?.type),
        [priority?.type],
    );
    const priorityColor = React.useMemo(
        () => KanbanPrioritiesEnum.getColorByType(priority?.type),
        [priority?.type],
    );

    return (
        <div className={props.bem.element('content')}>
            {description && (
                <Text
                    type="body"
                    content={description}
                    tag="p"
                />
            )}
            {!!tags?.length && (
                <div
                    className={props.bem.element('row', 'tags')}
                >
                    {tags.map(toTags)}
                </div>
            )}
            <div className={props.bem.element('row')}>
                <Text
                    type='body3'
                    content='Приоритет'
                    color="light-dark"
                />
                <div className={props.bem.element('data')}>
                    <Badge
                        size="md"
                        roundingStyle="squarer"
                        message={priorityLabel}
                        type={priorityColor}
                    />
                </div>
            </div>
            {assigner && (
                <div className={props.bem.element('row')}>
                    <Text
                        type='body3'
                        content='Исполнитель'
                        color="light-dark"
                    />
                    <div className={props.bem.element('data')}>
                        <div className={props.bem.element('assigner')}>
                            <Avatar
                                src={assigner.avatar?.src}
                                title={assigner.firstName}
                                size='sm'
                            />
                            <Text
                                type="body"
                                content={`${assigner.firstName || ''} ${assigner.lastName || ''}`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
