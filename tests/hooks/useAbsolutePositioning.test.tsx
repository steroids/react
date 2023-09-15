import {act, renderHook, waitFor} from '@testing-library/react';

import {useAbsolutePositioning} from '../../src/hooks';
import {IAbsolutePositioningInputProps, Positions} from '../../src/hooks/useAbsolutePositioning';

const DEFAULT_PROPS: IAbsolutePositioningInputProps = {
    position: Positions.TOP,
    gap: 5,
    componentDestroyDelay: 100,
    visible: true,
    onVisibleChange: jest.fn(),
};

describe('useAbsolutePositioning hook', () => {
    it('should return correct position', () => {
        const {result} = renderHook(() => useAbsolutePositioning(DEFAULT_PROPS));

        expect(result.current.position).toEqual(DEFAULT_PROPS.position);
    });

    it('should initialize with the correct visibility state', () => {
        const {result} = renderHook(() => useAbsolutePositioning(DEFAULT_PROPS));
        expect(result.current.isComponentExist).toBe(true);
        expect(result.current.isComponentVisible).toBe(false);

        waitFor(() => {
            expect(result.current.isComponentVisible).toEqual(true);
        });
    });

    it('should toggle visibility correctly when `onShow` handler is called', () => {
        const {result} = renderHook(() => useAbsolutePositioning({visible: false, ...DEFAULT_PROPS}));
        expect(result.current.isComponentVisible).toBe(false);
        expect(result.current.onShow).toBeInstanceOf(Function);

        act(() => {
            result.current.onShow();
        });

        waitFor(() => {
            expect(result.current.isComponentVisible).toEqual(true);
        });
    });

    it('should toggle visibility correctly when `onHide` handler is called', () => {
        const {result} = renderHook(() => useAbsolutePositioning(DEFAULT_PROPS));
        expect(result.current.onHide).toBeInstanceOf(Function);

        act(() => {
            result.current.onHide();
        });

        expect(result.current.isComponentVisible).toBe(false);
        waitFor(() => {
            expect(result.current.isComponentExist).toBe(false);
        });
    });

    it('should call onVisibleChange callback then isComponentVisible has changed', () => {
        const {result} = renderHook(() => useAbsolutePositioning(DEFAULT_PROPS));

        act(() => {
            result.current.onHide();
        });

        expect(DEFAULT_PROPS.onVisibleChange).toHaveBeenCalledWith(false);
    });
});
