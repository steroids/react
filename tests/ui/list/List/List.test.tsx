import '@testing-library/jest-dom';
import {fireEvent, screen, waitFor} from '@testing-library/dom';
import React from 'react';
import {act} from 'react-dom/test-utils';
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
    {
        id: 3,
        name: 'Jhon',
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
        className: 'list-group',
        itemView: (props: any) => (
            <div className='list-group-item'>
                <div>{props.item.name}</div>
            </div>
        ),
    };

    const expectedListClass = 'ListView';
    const expectedSearchFormClass = 'FormView';
    const expectedInputFieldClass = 'InputFieldView';
    const expectedButtonClass = 'ButtonView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(List, propsList));
        const SearchForm = getElementByClassName(container, expectedListClass);

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

    // it('should must be correct filtered items', async () => {
    //     const {container, getByText} = render(JSXWrapper(List, propsList));
    //     const input = getElementByTag(container, 'input');
    //     const button = getElementByTag(container, 'button');

    //     const item1 = getByText(items[0].name);
    //     const item2 = getByText(items[1].name);
    //     const item3 = getByText(items[2].name);

    //     await act(async () => {
    //         fireEvent.change(input, {target: {value: 'Ivan'}});
    //     });

    //     await act(async () => {
    //         fireEvent.click(button);
    //     });

    //     expect(item1).toBeInTheDocument();
    //     screen.debug();
    //     expect(item2).not.toBeInTheDocument();
    //     expect(item3).not.toBeInTheDocument();
    // });
});
