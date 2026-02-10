import * as React from 'react';
import {act} from 'react-dom/test-utils';
import configureMockStore from 'redux-mock-store';

import useDataProvider, {IDataProviderConfig} from '../../src/hooks/useDataProvider';
import mountWithApp from '../mocks/mountWithApp';
import prepareMiddleware from '../mocks/storeMiddlewareMock';

const mockStore = configureMockStore([prepareMiddleware]);

function MockResultComponent(props: any) {
  return <div />;
}
function MockComponent(config: IDataProviderConfig) {
  return <MockResultComponent {...useDataProvider(config)} />;
}

jest.useFakeTimers();

describe('hook useDataProvider', () => {
    it('smart search query', async () => {
        const items = [
            {
                id: 1,
                label: 'Ivanov',
            },
            {
                id: 2,
                label: 'Petrov',
            },
            {
                id: 3,
                label: 'John',
            },
        ];
        const wrapper = mountWithApp(MockComponent, {
            items,
            autoComplete: true,
        });

        expect(wrapper.find('MockComponent').prop('query')).toEqual(undefined);
        wrapper.setProps({
            items,
            query: 'Ivan',
        } as any);

        expect(wrapper.find('MockComponent').prop('query')).toEqual('Ivan');
        wrapper.update();

        expect(wrapper.find('MockResultComponent').prop('items')).toEqual([
            {
                ...items[0],
                labelHighlighted: [['Ivan', true], ['ov', false]],
            },
        ]);
        expect(wrapper.find('MockResultComponent').prop('sourceItems')).toEqual(items);
    });

    xit('items as enum', () => {
        const labels = [
            {
                id: 1,
                label: 'First',
            },
        ];
        const store = mockStore({
            fields: {
                meta: {
                    'app.test.enums.Foo': {
                        labels,
                    },
                },
            },
        });
        const wrapper = mountWithApp(MockComponent, {
            items: 'app.test.enums.Foo',
            config: {
                useGlobal: false,
                components: {
                    store: {
                        store,
                    },
                },
            },
        });

        // @todo assertions are failing, fix them
        expect(wrapper.find('MockResultComponent').prop('items')).toEqual(labels);
        expect(wrapper.find('MockResultComponent').prop('sourceItems')).toEqual(labels);
        expect(wrapper.find('MockResultComponent').prop('isLoading')).toEqual(false);
    });

    it('items as strings', () => {
        const wrapper = mountWithApp(MockComponent, {
            items: ['a', 'b'],
        });
        expect(wrapper.find('MockResultComponent').prop('items')).toEqual([
            {
                id: 'a',
                label: 'a',
            },
            {
                id: 'b',
                label: 'b',
            },
        ]);
    });

    it('async data provider', async () => {
        const onSearch = jest.fn(() => new Promise<any>(resolve => {
            setTimeout(() => resolve(['q1', 'q2']), 500);
        }));

        const wrapper = mountWithApp(MockComponent, {
            dataProvider: {onSearch},
            autoFetch: true,
        });

        expect(onSearch).toBeCalled();
        expect(onSearch).toHaveBeenCalledTimes(1);
        expect(wrapper.find('MockResultComponent').prop('isLoading')).toEqual(true);

        await act(async () => {
            jest.runAllTimers();
            await (() => new Promise(setImmediate))();
            wrapper.update();

            expect(wrapper.find('MockResultComponent').prop('isLoading')).toEqual(false);
            expect(wrapper.find('MockResultComponent').prop('items')).toEqual([
                {
                    id: 'q1',
                    label: 'q1',
                },
                {
                    id: 'q2',
                    label: 'q2',
                },
            ]);
        });
    });
});
