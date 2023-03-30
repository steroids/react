import * as React from 'react';

import {useComponents} from '../../src/hooks';
import {IComponents} from '../../src/providers/ComponentsProvider';
import mountWithApp from '../mocks/mountWithApp';

const MockResultComponent = (props: any) => <div />;
const MockComponent = (props: any) => (
    <MockResultComponent components={useComponents()} />
);

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
