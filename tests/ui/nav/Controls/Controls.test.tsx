import '@testing-library/jest-dom';
import ControlsMockView from './ControlsMockView';
import {JSXWrapper, getElementByClassName, render} from '../../../helpers';
import Controls from '../../../../src/ui/nav/Controls/Controls';

describe('Controls tests', () => {
    const items = [
        {
            id: 'back',
            onClick: () => alert('Go back'),
        },
        {
            id: 'create',
            onClick: () => alert('Something is created'),
        },
        {
            id: 'view',
            onClick: () => alert('Something is shown'),
        },
        {
            id: 'update',
            onClick: () => alert('Something is updated'),
        },
        {
            id: 'delete',
            onClick: () => alert('Something is deleted'),
        },
    ];

    const defaultControlsLabels = ['К списку', 'Добавить', 'Просмотр', 'Редактировать', 'Удалить'];

    const props = {
        view: ControlsMockView,
        className: 'testClass',
        items,
    };

    const expectedControlsClassName = 'ControlsView';
    const wrapper = JSXWrapper(Controls, props);

    it('should be in the document and have className', () => {
        const {container} = render(wrapper);
        const controls = getElementByClassName(container, expectedControlsClassName);

        expect(controls).toBeInTheDocument();
        expect(controls).toHaveClass(props.className);
    });

    it('should have right count of items', () => {
        const expectedControlClassName = 'ButtonView';

        const {container} = render(wrapper);
        const controls = container.getElementsByClassName(expectedControlClassName);

        expect(controls.length).toEqual(items.length);
    });

    it('should have correct labels', () => {
        const {container, getByText} = render(wrapper);
        const controls = getElementByClassName(container, expectedControlsClassName);

        defaultControlsLabels.forEach(label => expect(getByText(label)).toBeInTheDocument());
    });
});
