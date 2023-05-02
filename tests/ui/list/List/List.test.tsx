import '@testing-library/jest-dom';
import React from 'react';
import {fireEvent, waitForElementToBeRemoved} from '@testing-library/react';
import {render} from '../../../customRender';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
import ListMockView from './ListMockView';
import List from '../../../../src/ui/list/List/List';
import InputField from '../../../../src/ui/form/InputField/InputField';

const items = [
    {
        id: 1,
        name: 'Ivan',
    },
    {
        id: 2,
        name: 'Petr',
    },
];

const searchForm = {
    className: 'class-test',
    style: {fontSize: '4rem'},
    fields: [
        {
            attribute: 'name',
            component: InputField,
        },
    ],
};

describe('searchForm tests', () => {
    const propsList = {
        view: ListMockView,
        listId: 'ListDemoSearch',
        items,
        searchForm,
        pagination: {position: 'mockPosition'},
        className: 'list-group',
        itemView: (props: any) => (
            <div className='list-group-item'>
                <div>{props.item.name}</div>
            </div>
        ),
    };

    const expectedSearchFormClass = 'FormView';
    const expectedInputFieldClass = 'InputFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(List, propsList));
        const SearchForm = getElementByClassName(container, expectedSearchFormClass);

        expect(SearchForm).toBeInTheDocument();
    });

    it('should have correct className and style', () => {
        const {container} = render(JSXWrapper(List, propsList));
        const SearchForm = getElementByClassName(container, expectedSearchFormClass);

        expect(SearchForm).toHaveClass(searchForm.className);
        expect(SearchForm).toHaveStyle(searchForm.style);
    });

    it('should have correct fields count', () => {
        const {container} = render(JSXWrapper(List, propsList));
        const fields = container.querySelectorAll(`.${expectedInputFieldClass}`).length;

        expect(fields).toBe(searchForm.fields.length);
    });

    it('should must be correct filtered items', async () => {
        const {container, getByText, queryByText} = render(JSXWrapper(List, propsList));
        const input = getElementByTag(container, 'input');
        const button = getElementByTag(container, 'button');
        const DeletedItem = getByText('Petr');

        expect(DeletedItem).toBeInTheDocument();

        fireEvent.change(input, {target: {value: items[0].name}});
        fireEvent.click(button);

        await waitForElementToBeRemoved(() => getByText(items[1].name));
        expect(queryByText(items[1].name)).not.toBeInTheDocument();
    });
});
