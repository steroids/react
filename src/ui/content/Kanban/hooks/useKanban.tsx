import React, {useCallback} from 'react';
import {useMount} from 'react-use';
import {IDropDownFieldItem} from '@steroidsjs/core/ui/form/DropDownField/DropDownField';
import Modal from '../../../modal/Modal';
import {closeModal, openModal} from '../../../../actions/modal';
import {useSelector, useDispatch, useComponents} from '../../../../hooks';
import {IDragEndResult, IKanbanColumn, ITaskAssigner, ITaskPriority, ITaskTag} from '../Kanban';
import {KanbanModalsEnum} from '../enums';
import {getKanban, getKanbanPriorities, getKanbanTags, getLastTaskId} from '../reducers';
import {
    kanbanInit,
    kanbanMoveTask,
    kanbanMoveColumn,
    kanbanAddTask,
    kanbanEditTask, kanbanIncreaseTaskId,
} from '../actions';

export interface IKanbanConfig {
    /**
     * Идентификатор канбан доски
     * @example TasksKanban
     */
    kanbanId?: string;

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
    columns?: IKanbanColumn[];

    /**
     * Массив тегов для задач, по умолчанию будут установлены предоставляемые теги
     */
    tags?: ITaskTag[];

    /**
     * Массив приоритетов для задач, по умолчанию будут установлены предоставляемые приоритеты
     */
    priorities?: ITaskPriority[];

    /**
     * Обработчик события окончания перетаскивания карточки или колонки
     * В result передается объект с информацией о событии
     * @example {
     *     draggableId: 1,
     *     type: 'task',
     *     source: {
     *         index: 0,
     *         droppableId: 2
     *     },
     *     reason: 'DROP',
     *     mode: 'FLUID',
     *     destination: {
     *         droppableId: 2,
     *         index: 1
     *     },
     *     combine: null
     * }
     */
    onDragEnd?: (result: IDragEndResult) => void;

    /**
     * Идентификатор последней созданной задачи, нужен для определения последовательности id для новых задач
     */
    lastTaskId?: number;
}

const COLUMNS_DROPPABLE_ID = 'all-columns';

const DEFAULT_COLUMNS = [
    {
        id: 'column-1',
        title: 'TO DO',
        tasks: [],
    },
    {
        id: 'column-2',
        title: 'IN PROGRESS',
        tasks: [],
    },
    {
        id: 'column-3',
        title: 'IN REVIEW',
        tasks: [],
    },
    {
        id: 'column-4',
        title: 'DONE',
        tasks: [],
    },
];

export const DEFAULT_USERS: ITaskAssigner[] = [
    {
        id: 1,
        firstName: 'Ivan',
        lastName: 'Ivanov',
        avatar: {
            src: 'https://i.ibb.co/FDkpf8Z/image.png',
        },
    },
    {
        id: 2,
        firstName: 'Sophia',
        lastName: 'Miller',
        avatar: {
            src: 'https://i.ibb.co/xjkhs5Q/image.png',
        },
    },
    {
        id: 3,
        firstName: 'Geoge',
        lastName: 'Vyazov',
        avatar: {
            src: 'https://i.ibb.co/VVZtPPm/image.png',
        },
    },
];

const DEFAULT_TAGS: ITaskTag[] = [
    {
        id: 1,
        message: 'Design',
        type: 'warning',
    },
    {
        id: 2,
        message: 'Marketing',
        type: 'danger',
    },
    {
        id: 3,
        message: 'Simplify Navigation',
        type: 'primary',
    },
    {
        id: 4,
        message: 'Frontend',
        type: 'success',
    },
    {
        id: 5,
        message: 'New issue',
        type: 'info',
    },
];

const DEFAULT_PRIORITIES: ITaskPriority[] = [
    {
        id: 1,
        type: 'high',
    },
    {
        id: 2,
        type: 'middle',
    },
    {
        id: 3,
        type: 'default',
    },
];

const INITIAL_LAST_TASK_ID = 1;

const normalizeUsersForDropDownItems = (users: ITaskAssigner[]): IDropDownFieldItem[] => users.map((user) => ({
    id: user.id,
    label: `${user.firstName} ${user.lastName}`,
    contentType: 'img',
    contentSrc: user.avatar.src,
}));

const normalizeEditTaskFormForState = (id, data, tags, priorities) => ({
    id,
    title: data.title || '',
    description: data.description || '',
    fullDescription: data.fullDescription || '',
    priority: priorities.find((priority) => priority.id === data.priority),
    assigner: DEFAULT_USERS.find((user) => user.id === data.assigner),
    tags: data.tags && tags.filter((tag) => data.tags.includes(tag.id)),
});

export default function useKanban(config: IKanbanConfig) {
    const {kanban, lastTaskId, tags, priorities} = useSelector(state => ({
        kanban: getKanban(state, config.kanbanId),
        lastTaskId: getLastTaskId(state, config.kanbanId),
        tags: getKanbanTags(state, config.kanbanId),
        priorities: getKanbanPriorities(state, config.kanbanId),
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
        const newTaskId = lastTaskId + 1;
        const newTask = normalizeEditTaskFormForState(newTaskId, data, tags, priorities);

        const toDispatch = [
            kanbanAddTask(config.kanbanId, data.columnId, newTask),
            kanbanIncreaseTaskId(config.kanbanId, newTaskId),
            closeModal(KanbanModalsEnum.CREATE_TASK_MODAL_ID),
        ];

        dispatch(toDispatch);
    }, [config.kanbanId, dispatch, lastTaskId, priorities, tags]);

    const onEditTask = React.useCallback((id, data) => {
        const editedTaskFields = normalizeEditTaskFormForState(id, data, tags, priorities);

        const toDispatch = [
            kanbanEditTask(config.kanbanId, data.columnId, editedTaskFields),
            closeModal(KanbanModalsEnum.EDIT_TASK_MODAL_ID),
        ];

        dispatch(toDispatch);
    }, [config.kanbanId, dispatch, priorities, tags]);

    // create task modal
    const createOrEditTaskModalContent = components.ui.getView('content.CreateOrEditTaskModalContentView');
    const createCreateTaskModalProps = React.useMemo(() => ({
        modalId: KanbanModalsEnum.CREATE_TASK_MODAL_ID,
        formId: 'CreateTaskForm',
        className: 'CreateOrEditTaskModalContentView',
        title: KanbanModalsEnum.CREATE_TASK_TITLE,
        columns: kanban?.columns,
        size: 'lg',
        assigners: normalizeUsersForDropDownItems(DEFAULT_USERS),
        tags,
        submitButtonLabel: __('Создать'),
        onSubmit: onCreateTask,
        component: createOrEditTaskModalContent,
    }), [createOrEditTaskModalContent, kanban?.columns, onCreateTask, tags]);

    const onOpenCreateTaskModal = React.useCallback((columnId) => {
        if (columnId) {
            dispatch(openModal(Modal, {
                ...createCreateTaskModalProps,
                columnId,
            }));
        }
    }, [createCreateTaskModalProps, dispatch]);

    // task details modal
    const taskDetailsModalContent = components.ui.getView('content.TaskDetailsModalContentView');
    const onOpenTaskDetailsModal = React.useCallback((task, columnId) => {
        if (task && columnId) {
            dispatch(openModal(Modal, {
                modalId: KanbanModalsEnum.EDIT_TASK_MODAL_ID,
                size: 'lg',
                columns: kanban?.columns,
                title: `#${task.id} ${task.title}`,
                columnId,
                task,
                className: 'TaskDetailsModalContentView',
                component: taskDetailsModalContent,
                buttons: [{
                    icon: 'edit',
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    onClick: () => onOpenEditTaskModal(task, columnId),
                }],
            }));
        }
    }, [dispatch, kanban?.columns, tags, taskDetailsModalContent]);

    // edit task modal
    const onOpenEditTaskModal = React.useCallback((task, columnId) => {
        if (task && columnId) {
            dispatch(openModal(Modal, {
                modalId: KanbanModalsEnum.EDIT_TASK_MODAL_ID,
                size: 'lg',
                columns: kanban?.columns,
                formId: 'EditTaskForm',
                className: 'CreateOrEditTaskModalContentView',
                title: KanbanModalsEnum.EDIT_TASK_TITLE,
                assigners: normalizeUsersForDropDownItems(DEFAULT_USERS),
                tags,
                onSubmit: onEditTask,
                submitButtonLabel: __('Сохранить'),
                component: createOrEditTaskModalContent,
                buttons: [{
                    icon: 'expand_left_double',
                    onClick: () => onOpenTaskDetailsModal(task, columnId),
                }],
            }));
        }
    }, [createOrEditTaskModalContent, dispatch, kanban?.columns, onEditTask, onOpenTaskDetailsModal, tags]);

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
                columns: config.columns || DEFAULT_COLUMNS,
                tags: config.tags || DEFAULT_TAGS,
                priorities: config.priorities || DEFAULT_PRIORITIES,
                lastTaskId: config.lastTaskId || INITIAL_LAST_TASK_ID,
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
