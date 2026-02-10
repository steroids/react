import '@testing-library/jest-dom';
import Kanban from '../../../../src/ui/content/Kanban/Kanban';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';

const Droppable = ({children}) => children({
    draggableProps: {
        style: {},
    },
    innerRef: jest.fn(),
}, {});

const Draggable = ({children}) => children({
    draggableProps: {
        style: {},
    },
    innerRef: jest.fn(),
}, {});

const DragDropContext = ({children}) => children;

describe('Kanban tests', () => {
    const expectedKanbanClass = 'KanbanView';
    const expectedColumnClass = 'KanbanColumnView';
    const expectedTaskClass = 'KanbanTaskView';

    const assigners = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            avatar: {
                src: 'image.png',
            },
        },
    ];

    const tags = [
        {
            id: 1,
            message: 'tag',
            type: 'primary',
        },
    ];

    const priorities = [
        {
            id: 1,
            type: 'high',
        },
    ];

    const tasks = [
        {
            id: 1,
            title: 'task-1',
            description: 'task-1 desc',
            priority: priorities[0],
            assigner: assigners[0],
            tags,
        },
        {
            id: 2,
            title: 'task-2',
            description: 'task-2 desc',
        },
        {
            id: 3,
            title: 'task-3',
        },
    ];

    const columns = [{
        id: 1,
        title: 'TO DO',
        tasks,
    }];

    const props = {
        kanbanId: 'Kanban',
        draggableComponent: Draggable,
        droppableComponent: Droppable,
        dndContext: DragDropContext,
        assigners,
        tags,
        columns,
        priorities,
        lastTaskId: 339,
    };

    it('should render Kanban', () => {
        const {container} = render(JSXWrapper(Kanban, {
            ...props,
        }));

        const kanban = getElementByClassName(container, expectedKanbanClass);
        const column = getElementByClassName(container, expectedColumnClass);

        expect(kanban).toBeInTheDocument();
        expect(column).toBeInTheDocument();
    });

    it('should render columns from props', () => {
        const {container} = render(JSXWrapper(Kanban, {
            ...props,
        }));

        const columnElements = container.querySelectorAll(`.${expectedColumnClass}`);

        expect(columnElements.length).toEqual(columns.length);
    });

    it('should render correct column title', () => {
        const expectedColumnTitle = columns[0].title;

        const {queryByText} = render(JSXWrapper(Kanban, {
            ...props,
        }));

        expect(queryByText(expectedColumnTitle)).toBeInTheDocument();
    });

    it('should render correct column tasks counter', () => {
        const expectedColumnTasksCount = columns[0].tasks.length;

        const {queryByText, getByText} = render(JSXWrapper(Kanban, {
            ...props,
        }));

        expect(queryByText(expectedColumnTasksCount)).toBeInTheDocument();
        expect(getByText(expectedColumnTasksCount)).toBeInTheDocument();
    });

    it('should render tasks cards', () => {
        const expectedTasksInFirstColumn = tasks.length;
        const {container} = render(JSXWrapper(Kanban, {
            ...props,
        }));

        const taskElements = container.querySelectorAll(`.${expectedTaskClass}`);

        expect(taskElements.length).toEqual(expectedTasksInFirstColumn);
    });

    it('should render task card info', () => {
        const expectedTaskTitle = tasks[0].title;
        const expectedTaskDescription = tasks[0].description;
        const expectedTagText = tags[0].message;

        const {queryByText} = render(JSXWrapper(Kanban, {
            ...props,
        }));

        expect(queryByText(expectedTaskTitle)).toBeInTheDocument();
        expect(queryByText(expectedTaskDescription)).toBeInTheDocument();
        expect(queryByText(expectedTagText)).toBeInTheDocument();
    });

    it('should render create task button', () => {
        const {container} = render(JSXWrapper(Kanban, {
            ...props,
        }));

        const button = getElementByTag(container, 'button');

        expect(button).toBeInTheDocument();
    });
});
