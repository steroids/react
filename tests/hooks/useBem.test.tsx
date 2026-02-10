import * as React from 'react';
import {act} from 'react-dom/test-utils';
import configureMockStore from 'redux-mock-store';

import useBem, {IBem} from '../../src/hooks/useBem';
import mountWithApp from '../mocks/mountWithApp';
import prepareMiddleware from '../mocks/storeMiddlewareMock';

const mockStore = configureMockStore([prepareMiddleware]);

function MockResultComponent(props: any) {
  return <div />;
}
function MockComponent(props: any) {
  return <MockResultComponent bem={useBem(props.namespace)} />;
}

jest.useFakeTimers();

describe('hook useBem', () => {
    it('usage', async () => {
        const wrapper = mountWithApp(MockComponent, {
            namespace: 'Foo',
        });
        const bem: IBem = wrapper.find('MockResultComponent').prop('bem');

        expect(typeof bem).toEqual('function');
        expect(typeof bem.element).toEqual('function');
        expect(typeof bem.block).toEqual('function');
        expect(bem.block()).toEqual('Foo');
        expect(bem.block({mode: 1})).toEqual('Foo Foo_mode_1');
        expect(bem.block({mode: 'one'})).toEqual('Foo Foo_mode_one');
        expect(bem.block({mode: true})).toEqual('Foo Foo_mode');
        expect(bem.element('test')).toEqual('Foo__test');
        expect(bem.element('test', {active: false})).toEqual('Foo__test');
        expect(bem.element('test', {active: true})).toEqual('Foo__test Foo__test_active');
    });
});
