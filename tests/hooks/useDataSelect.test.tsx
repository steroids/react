import * as React from 'react';
import {act} from 'react-dom/test-utils';
import useDataSelect, {IDataSelectConfig} from '../../src/hooks/useDataSelect';
import mountWithApp from '../mocks/mountWithApp';

const MockResultComponent = (props: any) => (
    <div className='list'>
        {props.items.map(item => (
            <div
                key={'id-' + item.id}
                className={[
                    'item-' + item.id,
                    props.hoveredId === item.id && 'hovered',
                    props.selectedIds.includes(item.id) && 'selected',
                ]
                    .filter(Boolean)
                    .join(' ')}
            />
        ))}
    </div>
);
const MockComponent = (props: IDataSelectConfig) => (
    <MockResultComponent
        {...props}
        {...useDataSelect(props)}
    />
);

jest.useFakeTimers();

const items = [
    {
        id: 52,
        name: 'Ivanov',
    },
    {
        id: 28,
        name: 'Petrov',
    },
    {
        id: 33,
        name: 'John',
    },
];

describe.skip('hook useDataSelect', () => {
    // TODO keyboard test

    it('select multiple', async () => {
        const wrapper = mountWithApp(MockComponent, {
            items,
            multiple: true,
        });

        const {setSelectedIds} = wrapper.find('MockResultComponent').props() as any;

        await act(async () => {
            expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([]);
            expect(wrapper.find('.item-52').hasClass('selected')).toEqual(false);
            expect(wrapper.find('.item-28').hasClass('selected')).toEqual(false);
            expect(wrapper.find('.item-33').hasClass('selected')).toEqual(false);

            setSelectedIds([52, 28]);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([28, 52]);
            expect(wrapper.find('.item-52').hasClass('selected')).toEqual(true);
            expect(wrapper.find('.item-28').hasClass('selected')).toEqual(true);
            expect(wrapper.find('.item-33').hasClass('selected')).toEqual(false);

            setSelectedIds(null);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([]);
            expect(wrapper.find('.item-52').hasClass('selected')).toEqual(false);
            expect(wrapper.find('.item-28').hasClass('selected')).toEqual(false);
            expect(wrapper.find('.item-33').hasClass('selected')).toEqual(false);
        });
    });

    it('single select, open, hover', async () => {
        const wrapper = mountWithApp(MockComponent, {items});

        const {
            setIsOpened,
            setIsFocused,
            setHoveredId,
            setSelectedIds,
        } = wrapper.find('MockResultComponent').props() as any;

        // Open
        await act(async () => {
            setIsOpened(true);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('isOpened')).toEqual(true);

            setIsOpened(false);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('isOpened')).toEqual(false);
        });

        // Focus
        await act(async () => {
            setIsFocused(true);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('isFocused')).toEqual(true);

            setIsFocused(false);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('isFocused')).toEqual(false);
        });

        // Hover
        await act(async () => {
            expect(wrapper.find('MockResultComponent').prop('hoveredId')).toEqual(null);
            expect(wrapper.find('.item-28').hasClass('hovered')).toEqual(false);

            setHoveredId(28);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('hoveredId')).toEqual(28);
            expect(wrapper.find('.item-28').hasClass('hovered')).toEqual(true);

            setHoveredId(33);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('hoveredId')).toEqual(33);
            expect(wrapper.find('.item-28').hasClass('hovered')).toEqual(false);
            expect(wrapper.find('.item-33').hasClass('hovered')).toEqual(true);

            setHoveredId(null);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('hoveredId')).toEqual(null);
            expect(wrapper.find('.item-28').hasClass('hovered')).toEqual(false);
            expect(wrapper.find('.item-33').hasClass('hovered')).toEqual(false);
        });

        // Select signle
        await act(async () => {
            expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([]);
            expect(wrapper.find('.item-28').hasClass('selected')).toEqual(false);

            setSelectedIds(28); // not-array format
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([28]);
            expect(wrapper.find('.item-28').hasClass('selected')).toEqual(true);

            setSelectedIds([52, 28]); // try select multiple
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([52]);
            expect(wrapper.find('.item-28').hasClass('selected')).toEqual(false);
            expect(wrapper.find('.item-52').hasClass('selected')).toEqual(true);

            setSelectedIds(null);
            await (() => new Promise(setImmediate))();
            wrapper.update();
            expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([]);
            expect(wrapper.find('.item-28').hasClass('selected')).toEqual(false);
            expect(wrapper.find('.item-52').hasClass('selected')).toEqual(false);
        });
    });

    it('select first', async () => {
        const wrapper = mountWithApp(MockComponent, {
            items,
            selectFirst: true,
        });

        expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([items[0].id]);

        wrapper.setProps({selectedIds: [33]} as any);
        await (() => new Promise(setImmediate))();
        wrapper.update();
        expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([33]);
    });

    it('custom primary key', () => {
        const wrapper = mountWithApp(MockComponent, {
            items: [{foo: 'Bar'}],
            primaryKey: 'foo',
            selectFirst: true,
        });

        expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual(['Bar']);
    });

    it('initial selected ids', async () => {
        const wrapper = mountWithApp(MockComponent, {
            items,
            selectedIds: [28],
        });
        expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([28]);

        wrapper.setProps({selectFirst: true} as any);
        await (() => new Promise(setImmediate))();
        wrapper.update();
        expect(wrapper.find('MockResultComponent').prop('selectedIds')).toEqual([28]);
    });
});
