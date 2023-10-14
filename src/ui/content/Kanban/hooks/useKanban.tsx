import {useMount} from 'react-use';
import React, {useCallback} from 'react';
import {useSelector, useDispatch} from '../../../../hooks';
import {IKanbanColumn} from '../Kanban';
import {getKanban} from '../reducer';
import {
    kanbanInit,
    kanbanMoveTask,
    kanbanMoveColumn,
} from '../actions';

export interface IKanbanConfig {
    /**
     * Идентификатор канбан доски
     * @example TasksKanban
     */
    kanbanId?: string;

    /**
     * Колонки канбан доски
     */
    columns?: IKanbanColumn[];

    /**
     * Обработчик события окончания перетаскивания карточки или колонки
     */
    onDragEnd: (result: any) => void;
}

export const DEFAULT_COLUMNS = [
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

export default function useKanban(config: IKanbanConfig) {
    // Get kanban from redux state
    const kanban = useSelector(state => getKanban(state, config.kanbanId));

    const dispatch = useDispatch();

    // move card
    const moveCard = useCallback((source, destination) => {
        dispatch(kanbanMoveTask(config.kanbanId, source, destination));
    }, [config.kanbanId, dispatch]);

    // move column
    const moveColumn = useCallback((source, destination) => {
        dispatch(kanbanMoveColumn(config.kanbanId, source, destination));
    }, [config.kanbanId, dispatch]);

    const onDragEnd = (result) => {
        if (config.onDragEnd) {
            config.onDragEnd.call(null, result);
        }

        // drop outside the column
        if (!result.destination) { return; }

        const {source, destination} = result;

        if (source.droppableId === 'all-columns') {
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
            }));
        }
    });

    return {
        columns: kanban?.columns,
        onDragEnd,
    };
}
