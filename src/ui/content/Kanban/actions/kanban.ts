export const KANBAN_INIT = '@kanban/init';
export const KANBAN_MOVE_TASK = '@kanban/move_task';
export const KANBAN_MOVE_COLUMN = '@kanban/move_column';

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
