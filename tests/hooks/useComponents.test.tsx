import * as React from 'react';
import {useComponents} from '../../src/hooks';
import {IComponents} from '../../src/providers/ComponentsProvider';
import mountWithApp from '../mocks/mountWithApp';

function MockResultComponent(props: any) {
  return <div />;
}
function MockComponent(props: any) {
  return <MockResultComponent components={useComponents()} />;
}

describe('useComponents hook', () => {
    it('usage', () => {
        const wrapper = mountWithApp(MockComponent, {});
        const components: IComponents = wrapper
            .find('MockResultComponent')
            .prop('components');

        expect('html' in components).toBe(true);
        expect('clientStorage' in components).toBe(true);
        expect('meta' in components).toBe(true);
        expect('store' in components).toBe(true);
        expect('ui' in components).toBe(true);
        expect('metrics' in components).toBe(true);
    });
});
