export const KANBAN_INIT = '@kanban/init';
export const KANBAN_MOVE_TASK = '@kanban/move_task';
export const KANBAN_MOVE_COLUMN = '@kanban/move_column';
export const KANBAN_ADD_TASK = '@kanban/add_task';
export const KANBAN_EDIT_TASK = '@kanban/edit_task';
export const KANBAN_INCREASE_TASK_ID = '@kanban/increase_task_id';

export const kanbanInit = (kanbanId, payload) => ({
    type: KANBAN_INIT,
    payload,
});

export const kanbanMoveTask = (kanbanId, source, destination) => ({
    type: KANBAN_MOVE_TASK,
    kanbanId,
    source,
    destination,
});

export const kanbanMoveColumn = (kanbanId, source, destination) => ({
    type: KANBAN_MOVE_COLUMN,
    kanbanId,
    source,
    destination,
});

export const kanbanAddTask = (kanbanId, columnId, task) => ({
    type: KANBAN_ADD_TASK,
    kanbanId,
    columnId,
    task,
});

export const kanbanEditTask = (kanbanId, columnId, prevColumnId, task) => ({
    type: KANBAN_EDIT_TASK,
    kanbanId,
    columnId,
    prevColumnId,
    task,
});

export const kanbanIncreaseTaskId = (kanbanId, lastTaskId) => ({
    type: KANBAN_INCREASE_TASK_ID,
    kanbanId,
    lastTaskId,
});
