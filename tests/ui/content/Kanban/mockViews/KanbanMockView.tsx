import {useBem} from '../../../../../src/hooks';
import {IKanbanViewProps} from '../../../../../src/ui/content/Kanban/Kanban';

export default function KanbanView(props: IKanbanViewProps) {
    const bem = useBem('KanbanView');

    const Droppable = props.droppableComponent;

    return (
        <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
        >
            {(provided) => (
                <div
                    className={bem.block()}
                    id="task-board"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={props.style}
                >
                    {props.columns?.map((column, index) => props.renderColumn(column, index))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}
