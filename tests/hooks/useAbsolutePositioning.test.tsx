import {act, renderHook, waitFor} from '@testing-library/react';

import {useAbsolutePositioning} from '../../src/hooks';
import {IAbsolutePositioningInputProps, Position} from '../../src/hooks/useAbsolutePositioning';

describe('useAbsolutePositioning hook', () => {
    const expectedComponentExist = true;
    const expectedComponentVisible = true;
    const expectedComponentNotVisible = false;
    const expectedComponentNotExist = false;

    const defaultProps: IAbsolutePositioningInputProps = {
        position: Position.TOP,
        gap: 5,
        componentDestroyDelay: 100,
        visible: true,
        onVisibleChange: jest.fn(),
    };

    it('should return correct position', () => {
        const {result} = renderHook(() => useAbsolutePositioning(defaultProps));

        expect(result.current.position).toEqual(defaultProps.position);
    });

    it('should initialize with the correct visibility state', () => {
        const {result} = renderHook(() => useAbsolutePositioning(defaultProps));
        expect(result.current.isComponentExist).toBe(expectedComponentExist);
        expect(result.current.isComponentVisible).toBe(expectedComponentNotVisible);

        waitFor(() => {
            expect(result.current.isComponentVisible).toEqual(expectedComponentVisible);
        });
    });

    it('should toggle visibility correctly when `onShow` handler is called', () => {
        const {result} = renderHook(() => useAbsolutePositioning({...defaultProps,
visible: false}));
        expect(result.current.isComponentVisible).toBe(expectedComponentNotVisible);
        expect(result.current.onShow).toBeInstanceOf(Function);

        act(() => {
            result.current.onShow();
        });

        waitFor(() => {
            expect(result.current.isComponentVisible).toEqual(expectedComponentVisible);
        });
    });

    it('should toggle visibility correctly when `onHide` handler is called', () => {
        const {result} = renderHook(() => useAbsolutePositioning(defaultProps));
        expect(result.current.onHide).toBeInstanceOf(Function);

        act(() => {
            result.current.onHide();
        });

        expect(result.current.isComponentVisible).toBe(expectedComponentNotVisible);
        waitFor(() => {
            expect(result.current.isComponentExist).toBe(expectedComponentNotExist);
        });
    });

    it('should call onVisibleChange callback then isComponentVisible has changed', () => {
        const {result} = renderHook(() => useAbsolutePositioning(defaultProps));

        act(() => {
            result.current.onHide();
        });

        expect(defaultProps.onVisibleChange).toHaveBeenCalledWith(expectedComponentNotVisible);
    });
});
