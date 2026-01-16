import '@testing-library/jest-dom';
import {useScreen} from '../../src/hooks';
import {renderHook} from '../helpers';

describe('useScreen hook', () => {
    const renderUseScreen = () => {
        const {result} = renderHook(() => useScreen(), {
            screen: {},
        });

        return result;
    };

    it('should return default width', () => {
        const expectedDefaultWidth = 1024;

        const result = renderUseScreen();

        expect(result.current.width).toBe(expectedDefaultWidth);
    });

    it('should return default phone width', () => {
        const expectedPhoneWidth = 320;

        const result = renderUseScreen();

        expect(result.current.media?.phone).toBe(expectedPhoneWidth);
    });

    it('should return default tablet width', () => {
        const expectedTabletWidth = 768;

        const result = renderUseScreen();

        expect(result.current.media?.tablet).toBe(expectedTabletWidth);
    });

    it('should return default desktop width', () => {
        const expectedDesktopWidth = 1024;

        const result = renderUseScreen();

        expect(result.current.media?.desktop).toBe(expectedDesktopWidth);
    });

    it('parameters must have a correct type', () => {
        const expectedFunctionType = 'function';
        const expectedObjectType = 'object';

        const result = renderUseScreen();

        const {media, setMedia, isPhone, isTablet, isDesktop, getDeviceType} = result.current;

        expect(typeof media).toBe(expectedObjectType);
        expect(typeof setMedia).toBe(expectedFunctionType);
        expect(typeof isPhone).toBe(expectedFunctionType);
        expect(typeof isTablet).toBe(expectedFunctionType);
        expect(typeof isDesktop).toBe(expectedFunctionType);
        expect(typeof getDeviceType).toBe(expectedFunctionType);
    });
});
