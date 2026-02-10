import {IHtmlFieldProps} from '@steroidsjs/core/ui/form/HtmlField/HtmlField';
import React, {useCallback} from 'react';
import {useMount} from 'react-use';

import {closeModal, openModal} from '../../../../actions/modal';
import {useSelector, useDispatch, useComponents} from '../../../../hooks';
import {IDropDownFieldItem} from '../../../form/DropDownField/DropDownField';
import {IDragEndResult, IKanbanColumn, IKanbanTask, ITaskAssigner, ITaskTag} from '../Kanban';
import {
    kanbanInit,
    kanbanMoveTask,
    kanbanMoveColumn,
    kanbanAddTask,
    kanbanEditTask,
    kanbanIncreaseTaskId,
} from '../actions';
import {
    CREATE_TASK_FORM_ID,
    CREATE_TASK_MODAL_ID,
    EDIT_TASK_FORM_ID,
    EDIT_TASK_MODAL_ID,
} from '../constants/modalAndFormIds';
import {KanbanModalTypeEnum, KanbanPrioritiesEnum} from '../enums';
import {getKanban, getKanbanTags, getLastTaskId} from '../reducers';

export interface IKanbanConfig {
    /**
     * Идентификатор канбан доски
     * @example TasksKanban
     */
    kanbanId?: string,

    /**
     * Коллекция с наименованиями и свойствами колонок в таблице
     * @example
     * [
     *  {
     *   id: 1,
     *   title: 'column 1',
     *   tasks: [
     *    {
     *      content: 'item 1',
     *      id: 1
     *    }
     *    ],
     *  },
     *  {
     *   id: 2,
     *   title: 'column 2',
     *   tasks: [],
     *  }
     * ]
     */
    columns: IKanbanColumn[],

    /**
     * Массив тегов для задач
     */
    tags?: ITaskTag[],

    /**
     * Массив исполнителей, которых можно назначить для выполнения задачи
     */
    assigners?: ITaskAssigner[],

    /**
     * Компоненты для подключения wysiwyg редактора
     * @example CKEditor
     */
    createTaskEditorConfig: Pick<IHtmlFieldProps, 'htmlComponent' | 'editorConstructor'>,

    /**
     * Обработчик события окончания перетаскивания карточки или колонки
     * В result передается объект с информацией о событии
     * @example
     * {
     *  draggableId: 1,
     *  type: 'task',
     *  source: {
     *   index: 0,
     *   droppableId: 2
     *  },
     *  reason: 'DROP',
     *  mode: 'FLUID',
     *  destination: {
     *    droppableId: 2,
     *    index: 1
     *  },
     *  combine: null
     * }
     */
    onDragEnd?: (result: IDragEndResult) => void,

    /**
     * Обработчик события создания карточки
     */
    onCreateTask?: (kanbanId: string, columnId: number, task: IKanbanTask) => void,

    /**
     * Обработчик события редактирования карточки
     */
    onEditTask?: (kanbanId: string, columnId: number, task: IKanbanTask) => void,

    /**
     * Идентификатор последней созданной задачи, нужен для определения последовательности id для новых задач
     */
    lastTaskId?: number,
}

const COLUMNS_DROPPABLE_ID = 'all-columns';

const INITIAL_TASK_ID = 1;

const normalizeAssignersForDropDownItems = (assigners: ITaskAssigner[]): IDropDownFieldItem[] => assigners.map((assigner) => ({
    id: assigner.id,
    label: `${assigner.firstName || ''} ${assigner.lastName || ''}`,
    contentType: assigner.avatar ? 'img' : 'icon',
    contentSrc: assigner.avatar?.src ?? 'user',
}));

const normalizeEditTaskFormForState = (id, data, assigners, tags) => ({
    id,
    title: data.title || '',
    description: data.description || '',
    fullDescription: data.fullDescription || '',
    priority: KanbanPrioritiesEnum.getPriorityById(data.priority),
    assigner: assigners.find((user) => user.id === data.assigner) || null,
    tags: data.tags && tags && tags.filter((tag) => data.tags.includes(tag.id)),
});

export default function useKanban(config: IKanbanConfig) {
    const {kanban, lastTaskId, tags} = useSelector(state => ({
        kanban: getKanban(state, config.kanbanId),
        lastTaskId: getLastTaskId(state, config.kanbanId),
        tags: getKanbanTags(state, config.kanbanId),
    }));

    const dispatch = useDispatch();

    // move card
    const moveCard = useCallback((source, destination) => {
        dispatch(kanbanMoveTask(config.kanbanId, source, destination));
    }, [config.kanbanId, dispatch]);

    // move column
    const moveColumn = useCallback((source, destination) => {
        dispatch(kanbanMoveColumn(config.kanbanId, source, destination));
    }, [config.kanbanId, dispatch]);

    const components = useComponents();

    const onCreateTask = React.useCallback((_, data) => {
        const newTaskId = lastTaskId ? lastTaskId + 1 : INITIAL_TASK_ID;
        const newTask = normalizeEditTaskFormForState(newTaskId, data, config.assigners, tags);

        if (config.onCreateTask) {
            config.onCreateTask(config.kanbanId, data.columnId, newTask);
        }

        const toDispatch = [
            kanbanAddTask(config.kanbanId, data.columnId, newTask),
            kanbanIncreaseTaskId(config.kanbanId, newTaskId),
            closeModal(CREATE_TASK_MODAL_ID),
        ];

        dispatch(toDispatch);
    }, [config, dispatch, lastTaskId, tags]);

    const onEditTask = React.useCallback((id, data, prevColumnId) => {
        const editedTask = normalizeEditTaskFormForState(id, data, config.assigners, tags);

        if (config.onEditTask) {
            config.onEditTask(config.kanbanId, data.columnId, editedTask);
        }

        const toDispatch = [
            kanbanEditTask(config.kanbanId, data.columnId, prevColumnId, editedTask),
            closeModal(EDIT_TASK_MODAL_ID),
        ];

        dispatch(toDispatch);
    }, [config, dispatch, tags]);

    // common modal
    const KanbanModalView = components.ui.getView('content.KanbanModalView');
    const createOrEditTaskCommonModalProps = React.useMemo(() => ({
        createTaskEditorConfig: config.createTaskEditorConfig,
        columns: kanban?.columns,
        assigners: normalizeAssignersForDropDownItems(config.assigners || []),
        tags,
    }), [config.createTaskEditorConfig, config.assigners, kanban?.columns, tags]);

    // create task modal
    const onOpenCreateTaskModal = React.useCallback((columnId) => {
        if (columnId) {
            dispatch(openModal(KanbanModalView, {
                ...createOrEditTaskCommonModalProps,
                modalId: CREATE_TASK_MODAL_ID,
                modalType: KanbanModalTypeEnum.CREATE,
                title: KanbanModalTypeEnum.getLabel(KanbanModalTypeEnum.CREATE),
                formId: CREATE_TASK_FORM_ID,
                columnId,
                onSubmit: onCreateTask,
            }));
        }
    }, [KanbanModalView, createOrEditTaskCommonModalProps, dispatch, onCreateTask]);

    // task details modal
    const onOpenTaskDetailsModal = React.useCallback((task, columnId) => {
        if (task && columnId) {
            dispatch(openModal(KanbanModalView, {
                modalId: EDIT_TASK_MODAL_ID,
                modalType: KanbanModalTypeEnum.DETAILS,
                title: `#${task.id} ${task.title}`,
                task,
                tags,
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                onToggleModalType: () => onOpenEditTaskModal(task, columnId),
            }));
        }
    }, [KanbanModalView, dispatch, kanban]);

    // edit task modal
    const onOpenEditTaskModal = React.useCallback((task, columnId) => {
        if (task && columnId) {
            dispatch(openModal(KanbanModalView, {
                ...createOrEditTaskCommonModalProps,
                modalId: EDIT_TASK_MODAL_ID,
                modalType: KanbanModalTypeEnum.EDIT,
                title: KanbanModalTypeEnum.getLabel(KanbanModalTypeEnum.EDIT),
                formId: EDIT_TASK_FORM_ID,
                columnId,
                onSubmit: onEditTask,
                onToggleModalType: () => onOpenTaskDetailsModal(task, columnId),
            }));
        }
    }, [KanbanModalView, createOrEditTaskCommonModalProps, dispatch, onEditTask, onOpenTaskDetailsModal]);

    const onDragEnd = (result) => {
        if (config.onDragEnd) {
            config.onDragEnd(result);
        }

        // drop outside the column
        if (!result.destination) { return; }

        const {source, destination} = result;

        if (source.droppableId === COLUMNS_DROPPABLE_ID) {
            // handle the column movement
            moveColumn(source, destination);
        } else {
            // handle the task card movement
            moveCard(source, destination);
        }
    };

    // Init kanban in redux store
    useMount(() => {
        if (!kanban) {
            dispatch(kanbanInit(config.kanbanId, {
                kanbanId: config.kanbanId,
                columns: config.columns || null,
                tags: config.tags || null,
                lastTaskId: config.lastTaskId || null,
            }));
        }
    });

    return {
        columns: kanban?.columns,
        onDragEnd,
        onOpenTaskDetailsModal,
        onOpenCreateTaskModal,
    };
}
