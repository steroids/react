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

        const expectedDefaultWidth = 1024;
        expect(screen.width).toBe(expectedDefaultWidth);

        const expectedPhoneWidth = 320;
        expect(screen.media?.phone).toBe(expectedPhoneWidth);

        const expectedTabletWidth = 768;
        expect(screen.media?.tablet).toBe(expectedTabletWidth);

        const expectedDesktopWidth = 1024;
        expect(screen.media?.desktop).toBe(expectedDesktopWidth);

        expect(typeof screen.media).toBe('object');
        expect(typeof screen.setMedia).toBe('function');
        expect(typeof screen.isPhone).toBe('function');
        expect(typeof screen.isTablet).toBe('function');
        expect(typeof screen.isDesktop).toBe('function');
        expect(typeof screen.getDeviceType).toBe('function');
    });
});
