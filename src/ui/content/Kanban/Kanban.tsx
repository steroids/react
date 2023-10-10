import React, {useCallback} from 'react';
import {useComponents} from '@steroidsjs/core/hooks';
import {useKanban} from './hooks';

export interface ITaskTag {
    id: number;
    message: string;
    type: string;
}

// TODO add types
export interface IKanbanTask {
    id: string;
    title: string;
    description?: string;
    priority?: string;
    assigner?: any;
    tags?: ITaskTag[];
    status?: any;
}

export interface IKanbanColumn {
    id: string;
    title: string;
    tasks: IKanbanTask[];
}

interface IKanbanProps extends IUiComponent {
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

    /**
     * Переопределение view React компонента для кастомизации отображения
     * @example MyCustomView
     */
    view?: CustomView;

    /**
     * Коллекция с наименованиями и свойствами колонок в таблице
     * @example [
     *             {
     *              id: 'column-1',
     *              title: 'col1',
     *              tasks: [{ content: 'item1', id: 'task-1' }],
     *             },
     *             {
     *              id: 'column-2',
     *              title: 'col2',
     *              tasks: [],
     *             }
     *          ]
     */
    columns: IKanbanColumn[];

    /**
     * Обработчик события окончания перетаскивания карточки или колонки
     */
    onDragEnd: (result: any) => void;

    [key: string]: any;
}

export interface IKanbanTaskViewProps {
    task: IKanbanTask
    index: number
    draggableComponent: any;
}

export interface IKanbanColumnViewProps {
    column: IKanbanColumn
    columnIndex: number
    droppableComponent: any;
    draggableComponent: any;
    renderTask: (task, index) => any;
}

export type IKanbanViewProps = IKanbanProps;

export default function Kanban(props: IKanbanProps) {
    const components = useComponents();

    const DragDropContext = props.dndContext;

    const {
        columns,
        onDragEnd,
    } = useKanban({
        kanbanId: props.kanbanId,
        columns: props.columns,
        onDragEnd: props.onDragEnd,
    });

    // Task
    const Task = components.ui.getView('content.KanbanTaskView');
    const renderTask = useCallback((task, index) => (
        <Task
            key={task.id}
            task={task}
            index={index}
            draggableComponent={props.draggableComponent}
        />
    ), [Task, props.draggableComponent]);

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
        />
    ), [Column, props.draggableComponent, props.droppableComponent, renderTask]);

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
