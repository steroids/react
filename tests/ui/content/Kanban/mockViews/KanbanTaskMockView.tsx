import * as React from 'react';
import {useBem} from '../../../../../src/hooks';
import {IKanbanTaskViewProps} from '../../../../../src/ui/content/Kanban/Kanban';
import Avatar from '../../../../../src/ui/content/Avatar/Avatar';
import {Text} from '../../../../../src/ui/typography';
import TaskTags from './TaskTags/TaskTags';

export default function KanbanTaskView(props: IKanbanTaskViewProps) {
    const bem = useBem('KanbanTaskView');

    const {id, title, description, tags, assigner, priority} = props.task;

    const Draggable = props.draggableComponent;

    return (
        <Draggable
            draggableId={id.toString()}
            index={props.index}
        >
            {(provided) => (
                <div
                    className={bem.block()}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div className={bem.element('wrapper')}>
                        <div className={bem.element('content')}>
                            <div className={bem.element('header')}>
                                <h4
                                    className={bem.element('title')}
                                    aria-hidden="true"
                                    onClick={() => props.onOpenTaskDetailsModal(props.task, props.columnId)}
                                >
                                    <span className={bem.element('task-id')}>
                                        {`#${id} `}
                                    </span>
                                    {title}
                                </h4>
                            </div>
                            {description && (
                                <Text
                                    type='body2'
                                    content={description}
                                />
                            )}
                        </div>
                        <div className={bem.element('footer')}>
                            {tags && (<TaskTags tags={tags} />)}
                            {assigner && (
                                <div
                                    className={bem.element('assigner')}
                                >
                                    <Avatar
                                        src={assigner.avatar?.src}
                                        title={`${assigner.firstName} ${assigner.lastName}`}
                                        size='sm'
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {priority && (
                        <span className={bem.element('priority', !!priority && `${priority.type}`)} />
                    )}
                </div>
            )}
        </Draggable>
    );
}
