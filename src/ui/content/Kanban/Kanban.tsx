import React, {useCallback} from 'react';
import {IDropDownFieldItem} from '@steroidsjs/core/ui/form/DropDownField/DropDownField';
import {IKanbanConfig} from '@steroidsjs/core/ui/content/Kanban/hooks/useKanban';
import {KanbanModalTypeEnum} from '@steroidsjs/core/ui/content/Kanban/enums';
import {IBem} from '@steroidsjs/core/hooks/useBem';
import {IModalProps} from '../../modal/Modal/Modal';
import {useComponents} from '../../../hooks';
import {useKanban} from './hooks';

export interface ITaskTag {
    id: number;
    message: string;
    type: string;
}

export interface ITaskAssigner {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: {
        src: string;
    };
}

export interface ITaskPriority {
    id: number;
    type: string;
}

export interface IKanbanTask {
    id: string;
    title: string;
    description?: string;
    fullDescription?: string;
    priority?: ITaskPriority;
    assigner?: ITaskAssigner;
    tags?: ITaskTag[];
}

export interface IDragEndResult {
    draggableId: number;
    type: string;
    source: {
        index: number;
        droppableId: number;
    };
    reason: string;
    mode: string;
    destination: {
        droppableId: number;
        index: number;
    };
    combine: null;
}

export interface IKanbanColumn {
    id: string;
    title: string;
    tasks: IKanbanTask[];
}

export interface IKanbanModalViewProps extends IModalProps {
    modalType: KanbanModalTypeEnum;
    formId: string;
    columns: IKanbanColumn[];
    columnId: string;
    assigners: IDropDownFieldItem[];
    submitButtonLabel: string;
    onSubmit: (id: string | null, data: any, columnId: string) => void;
    onToggleModalType?: () => void;
    task?: IKanbanTask;
    tags?: ITaskTag[];
}

export interface ICreateOrEditTaskModalContentViewProps extends Omit<IKanbanModalViewProps, 'modalType'> {
    bem: IBem;
}

export interface IKanbanTaskDetailsModalViewProps extends IModalProps {
    bem: IBem;
    task: IKanbanTask;
}

export interface IKanbanProps extends IKanbanConfig, IUiComponent {
    /**
     * Компонент обертка для инициализации области куда можно переместить элемент из библиотеки react-beautiful-dnd
     * @example Droppable
     */
    droppableComponent: any;

    /**
     * Компонент обертка для регистрации элемента который можно переместить из библиотеки react-beautiful-dnd
     * @example Draggable
     */
    draggableComponent: any;

    /**
     * Общий контекст обертка из библиотеки react-beautiful-dnd
     * @example DragDropContext
     */
    dndContext: any;

    [key: string]: any;
}

export interface IKanbanTaskViewProps {
    task: IKanbanTask;
    columnId: string;
    index: number;
    draggableComponent: any;
    onOpenTaskDetailsModal: (task: IKanbanTask, columnId: string) => void;
}

export interface IKanbanColumnViewProps {
    column: IKanbanColumn;
    columnIndex: number;
    droppableComponent: any;
    draggableComponent: any;
    task?: IKanbanTask;
    renderTask: (task: IKanbanTask, columnId: string, index: number) => JSX.Element;
    onOpenCreateTaskModal: (columnId: string) => void;
}

export type IKanbanViewProps = IKanbanProps;

export default function Kanban(props: IKanbanProps) {
    const components = useComponents();

    const DragDropContext = props.dndContext;

    const {
        columns,
        onDragEnd,
        onOpenTaskDetailsModal,
        onOpenCreateTaskModal,
    } = useKanban({
        kanbanId: props.kanbanId,
        columns: props.columns,
        assigners: props.assigners,
        tags: props.tags,
        lastTaskId: props.lastTaskId,
        onDragEnd: props.onDragEnd,
    });

    // Task
    const Task = components.ui.getView('content.KanbanTaskView');
    const renderTask = useCallback((task, columnId, index) => (
        <Task
            key={task.id}
            task={task}
            columnId={columnId}
            index={index}
            draggableComponent={props.draggableComponent}
            onOpenTaskDetailsModal={onOpenTaskDetailsModal}
        />
    ), [Task, onOpenTaskDetailsModal, props.draggableComponent]);

    // Column
    const Column = components.ui.getView('content.KanbanColumnView');
    const renderColumn = useCallback((column, index) => (
        <Column
            key={column.id}
            column={column}
            columnIndex={index}
            draggableComponent={props.draggableComponent}
            droppableComponent={props.droppableComponent}
            renderTask={renderTask}
            onOpenCreateTaskModal={onOpenCreateTaskModal}
        />
    ), [Column, onOpenCreateTaskModal, props.draggableComponent, props.droppableComponent, renderTask]);

    return (
        <DragDropContext
            onDragEnd={onDragEnd}
        >
            {components.ui.renderView(props.view || 'content.KanbanView', {
                ...props,
                columns,
                renderColumn,
            })}
        </DragDropContext>
    );
}
