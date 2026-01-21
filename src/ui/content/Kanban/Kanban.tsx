import {IBem} from '@steroidsjs/core/hooks/useBem';
import {KanbanModalTypeEnum} from '@steroidsjs/core/ui/content/Kanban/enums';
import {IKanbanConfig} from '@steroidsjs/core/ui/content/Kanban/hooks/useKanban';
import {IDropDownFieldItem} from '@steroidsjs/core/ui/form/DropDownField/DropDownField';
import React, {useCallback, useMemo} from 'react';

import {useKanban} from './hooks';
import {useComponents} from '../../../hooks';
import {IModalProps} from '../../modal/Modal/Modal';

export interface ITaskTag {
    id: number,
    message: string,
    type: string,
}

export interface ITaskAssigner {
    id: number,
    firstName?: string,
    lastName?: string,
    avatar?: {
        src: string,
    },
}

export interface ITaskPriority {
    id: number,
    type: string,
}

export interface IKanbanTask {
    id: number,
    title: string,
    description?: string,
    fullDescription?: string,
    priority?: ITaskPriority,
    assigner?: ITaskAssigner,
    tags?: ITaskTag[],
}

export interface IDragEndResult {
    draggableId: number,
    type: string,
    source: {
        index: number,
        droppableId: number,
    },
    reason: string,
    mode: string,
    destination: {
        droppableId: number,
        index: number,
    },
    combine: null,
}

export interface IKanbanColumn {
    id: number,
    title: string,
    tasks: IKanbanTask[],
}

export interface IKanbanModalViewProps extends IModalProps, Pick<IKanbanConfig, 'createTaskEditorConfig'> {
    modalType: KanbanModalTypeEnum,
    formId: string,
    columns: IKanbanColumn[],
    columnId: string,
    assigners: IDropDownFieldItem[],
    submitButtonLabel: string,
    onSubmit: (id: string | null, data: any, columnId: string) => void,
    onToggleModalType?: () => void,
    task?: IKanbanTask,
    tags?: ITaskTag[],
}

export interface ICreateOrEditTaskModalContentViewProps extends Omit<IKanbanModalViewProps, 'modalType'> {
    bem: IBem,
}

export interface IKanbanTaskDetailsModalViewProps extends IModalProps {
    bem: IBem,
    task: IKanbanTask,
}

/**
 * Kanban
 *
 * Компонент `Kanban` позволяет создать доску для управления задачами.
 * Количество столбцов задается с помощью пропа `columns`.
 * Задачи на доске можно создавать, редактировать и перемещать с визуальным отображением.
 *
 * Для работы этого компонента необходимо установить в проекте зависимости `react-beautiful-dnd`
 * и передать в пропсы `droppableComponent`, `draggableComponent` и `dndContext`
 * компоненты `Droppable`, `Draggable` и `DragDropContext` соответственно.
 *
 * Для корректной работы функционала создания задач,
 * необходимо установить в проекте зависимости `@ckeditor/ckeditor5-react v3.0.2` и `@steroidsjs/ckeditor5 v27.0.2-rc.2`,
 * затем импортировать `CKEditor` из `@ckeditor/ckeditor5-react` и `ClassicEditor` из `@steroidsjs/ckeditor5/packages/ckeditor5-build-classic`.
 * Импортированные компоненты нужно передать в проп `createTaskEditorConfig`,
 * в поле `htmlComponent` передать `CKEditor`, а в `editorConstructor` передать `ClassicEditor`.
 */
export interface IKanbanProps extends IKanbanConfig, IUiComponent {
    /**
     * Компонент обертка для инициализации области куда можно переместить элемент из библиотеки react-beautiful-dnd
     * @example Droppable
     */
    droppableComponent: any,

    /**
     * Компонент обертка для регистрации элемента который можно переместить из библиотеки react-beautiful-dnd
     * @example Draggable
     */
    draggableComponent: any,

    /**
     * Общий контекст обертка из библиотеки react-beautiful-dnd
     * @example DragDropContext
     */
    dndContext: any,

    [key: string]: any,
}

export interface IKanbanTaskViewProps {
    task: IKanbanTask,
    columnId: string,
    index: number,
    draggableComponent: any,
    onOpenTaskDetailsModal: (task: IKanbanTask, columnId: string) => void,
}

export interface IKanbanColumnViewProps {
    column: IKanbanColumn,
    columnIndex: number,
    droppableComponent: any,
    draggableComponent: any,
    task?: IKanbanTask,
    renderTask: (task: IKanbanTask, columnId: number, index: number) => JSX.Element,
    onOpenCreateTaskModal: (columnId: number) => void,
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
        createTaskEditorConfig: props.createTaskEditorConfig,
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

    const viewProps = useMemo(() => ({
        columns,
        renderColumn,
        droppableComponent: props.droppableComponent,
        className: props.className,
        style: props.style,
    }), [columns, renderColumn, props.droppableComponent, props.className, props.style]);

    return (
        <DragDropContext
            onDragEnd={onDragEnd}
        >
            {components.ui.renderView(props.view || 'content.KanbanView', viewProps)}
        </DragDropContext>
    );
}
