import * as React from 'react';

import mountWithApp from '../mountWithApp';
import {useScreen} from '../../src/hooks';
import {IScreen} from '../../src/providers/ScreenProvider';

const MockResultComponent = (props: any) => <div />;
const MockComponent = (props: any) => (
    <MockResultComponent screen={useScreen()} />
);

describe('useScreen hook', () => {
    it('usage', () => {
        const wrapper = mountWithApp(MockComponent, {});
        const screen: IScreen = wrapper
            .find('MockResultComponent')
            .prop('screen');

        expect('width' in screen).toBe(true);
    });
});
