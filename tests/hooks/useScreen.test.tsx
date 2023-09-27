import '@testing-library/jest-dom';
import {renderHook} from '../customRenderHook';
import {useScreen} from '../../src/hooks';

describe('useScreen hook', () => {
    it('should return default width', () => {
        const expectedDefaultWidth = 1024;

        const {result} = renderHook(() => useScreen());

        expect(result.current.width).toBe(expectedDefaultWidth);
    });

    it('should return default phone width', () => {
        const expectedPhoneWidth = 320;

        const {result} = renderHook(() => useScreen());

        expect(result.current.media?.phone).toBe(expectedPhoneWidth);
    });

    it('should return default tablet width', () => {
        const expectedTabletWidth = 768;

        const {result} = renderHook(() => useScreen());

        expect(result.current.media?.tablet).toBe(expectedTabletWidth);
    });

    it('should return default desktop width', () => {
        const expectedDesktopWidth = 1024;

        const {result} = renderHook(() => useScreen());

        expect(result.current.media?.desktop).toBe(expectedDesktopWidth);
    });

    it('parameters must have a correct type', () => {
        const expectedFunctionType = 'function';
        const expectedObjectType = 'object';

        const {result} = renderHook(() => useScreen());

        const {media, setMedia, isPhone, isTablet, isDesktop, getDeviceType} = result.current;

        expect(typeof media).toBe(expectedObjectType);
        expect(typeof setMedia).toBe(expectedFunctionType);
        expect(typeof isPhone).toBe(expectedFunctionType);
        expect(typeof isTablet).toBe(expectedFunctionType);
        expect(typeof isDesktop).toBe(expectedFunctionType);
        expect(typeof getDeviceType).toBe(expectedFunctionType);
    });
});
