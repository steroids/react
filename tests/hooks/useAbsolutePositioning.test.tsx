import {act, renderHook, waitFor} from '@testing-library/react';

import {useAbsolutePositioning} from '../../src/hooks';
import {IAbsolutePositioningInputProps} from '../../src/hooks/useAbsolutePositioning';

const MOCKED_WINDOW_SCROLL_Y_VALUE = 20;
const MOCKED_DOCUMENT_BODY_CLIENT_WIDTH_VALUE = 320;
const MOCKED_WINDOW_INNER_HEIGHT_VALUE = 100;

let originalWindowScrollY: number;
let originalDocumentBodyClientWidth: number;
let originalWindowInnerHeight: number;

beforeAll(() => {
    originalWindowScrollY = global.window.scrollY;
    originalDocumentBodyClientWidth = global.document.body.clientWidth;
    originalWindowInnerHeight = global.window.innerHeight;

    Object.defineProperty(global.window, 'scrollY', {
        value: MOCKED_WINDOW_SCROLL_Y_VALUE,
        writable: true,
    });

    Object.defineProperty(global.document.body, 'clientWidth', {
        value: MOCKED_DOCUMENT_BODY_CLIENT_WIDTH_VALUE,
        writable: true,
    });

    Object.defineProperty(global.window, 'innerHeight', {
        value: MOCKED_WINDOW_INNER_HEIGHT_VALUE,
        writable: true,
    });
});

afterAll(() => {
    Object.defineProperty(global.window, 'scrollY', {
        value: originalWindowScrollY,
    });

    Object.defineProperty(global.document.body, 'clientWidth', {
        value: originalDocumentBodyClientWidth,
    });

    Object.defineProperty(global.window, 'innerHeight', {
        value: originalWindowInnerHeight,
    });
});

const enum POSITIONS {
    top = 'top',
    bottom= 'bottom',
    left= 'left',
    right= 'right'
}

const DEFAULT_PROPS: IAbsolutePositioningInputProps = {
    position: POSITIONS.top,
    autoPositioning: true,
    gap: 5,
    componentDestroyDelay: 100,
    visible: true,
    onVisibleChange: jest.fn(),
};

const DEFAULT_CHILD_REF = {
    getBoundingClientRect: () => ({
        top: 80,
        left: 10,
        width: 140,
        height: 40,
    }),
};

const DEFAULT_COMPONENT_SIZE = {
    height: 90,
    width: 200,
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

    it('should calculate the top position correctly', () => {
        const {result} = renderHook(() => useAbsolutePositioning(DEFAULT_PROPS));

        act(() => {
            const {calculateAbsolutePosition} = result.current;
            calculateAbsolutePosition(DEFAULT_PROPS.position, DEFAULT_CHILD_REF, DEFAULT_COMPONENT_SIZE);
        });

        const {top, height} = DEFAULT_CHILD_REF.getBoundingClientRect();

        expect(result.current.style.top).toBe(MOCKED_WINDOW_SCROLL_Y_VALUE + top + height);
    });

    it('should change position from top to the bottom correctly', () => {
        const {result} = renderHook(() => useAbsolutePositioning(DEFAULT_PROPS));

        act(() => {
            const {calculateAbsolutePosition} = result.current;
            calculateAbsolutePosition(DEFAULT_PROPS.position, DEFAULT_CHILD_REF, DEFAULT_COMPONENT_SIZE);
        });

        expect(result.current.position).toBe('bottom');
    });

    it('should change position from left to the right correctly', () => {
        const {result} = renderHook(() => useAbsolutePositioning({...DEFAULT_PROPS, position: POSITIONS.left}));

        act(() => {
            const childRef = {
                getBoundingClientRect: () => ({
                    top: 80,
                    left: 60,
                    width: 141,
                    height: 41,
                }),
            };

            const componentSize = {
                height: 90,
                width: 100,
            };

            const {calculateAbsolutePosition} = result.current;
            calculateAbsolutePosition(POSITIONS.left, childRef, componentSize);
        });

        expect(result.current.position).toBe(POSITIONS.right);
    });

    it('should change position from right to the left correctly', () => {
        const {result} = renderHook(() => useAbsolutePositioning({...DEFAULT_PROPS, position: POSITIONS.right}));

        act(() => {
            const childRef = {
                getBoundingClientRect: () => ({
                    top: 80,
                    right: 10,
                    width: 140,
                    height: 40,
                }),
            };

            const componentSize = {
                height: 90,
                width: 310,
            };

            const {calculateAbsolutePosition} = result.current;
            calculateAbsolutePosition(POSITIONS.right, childRef, componentSize);
        });

        expect(result.current.position).toBe(POSITIONS.left);
    });

    it('should change position from bottom to the top correctly', () => {
        const {result} = renderHook(() => useAbsolutePositioning({...DEFAULT_PROPS, position: POSITIONS.bottom}));

        act(() => {
            const componentSize = {
                height: 90,
                width: 310,
            };

            const {calculateAbsolutePosition} = result.current;
            calculateAbsolutePosition(POSITIONS.bottom, DEFAULT_CHILD_REF, componentSize);
        });

        expect(result.current.position).toBe(POSITIONS.top);
    });

    it('should set parent left value when tooltip calculated value less than 0', () => {
        const {result} = renderHook(() => useAbsolutePositioning(DEFAULT_PROPS));

        act(() => {
            const {calculateAbsolutePosition} = result.current;
            calculateAbsolutePosition(DEFAULT_PROPS.position, DEFAULT_CHILD_REF, DEFAULT_COMPONENT_SIZE);
        });

        expect(result.current.style.left).toBe(DEFAULT_CHILD_REF.getBoundingClientRect().left);
    });
});
