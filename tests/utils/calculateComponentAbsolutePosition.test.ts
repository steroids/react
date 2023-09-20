import {Position} from '../../src/hooks/useAbsolutePositioning';
import calculateComponentAbsolutePosition from '../../src/utils/calculateComponentAbsolutePosition';

const MOCKED_WINDOW_SCROLL_Y_VALUE = 0;
const MOCKED_DOCUMENT_BODY_CLIENT_WIDTH_VALUE = 375;
const MOCKED_WINDOW_INNER_HEIGHT_VALUE = 667;

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

const GAP = 15;

const PARENT_AT_THE_TOP_REF = {
    getBoundingClientRect: () => ({
        top: 61,
        left: 10,
        right: 365,
        width: 355,
        height: 42,
    }),
};

const PARENT_AT_THE_BOTTOM_REF = {
    getBoundingClientRect: () => ({
        top: 497,
        left: 197,
        right: 200,
        width: 167,
        height: 64,
    }),
};

const PARENT_AT_THE_CENTER_REF = {
    getBoundingClientRect: () => ({
        top: 190,
        left: 100,
        right: 250,
        width: 160,
        height: 40,
    }),
};

const DEFAULT_COMPONENT_SIZE = {
    height: 100,
    width: 200,
};

const LARGE_WIDTH_COMPONENT_SIZE = {
    height: 92,
    width: 375,
};

const LARGE_HEIGHT_COMPONENT_SIZE = {
    height: 224,
    width: 200,
};

const LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE = {
    height: 224,
    width: 70,
};

const ARROW_SIZE = {
    width: 14,
    height: 14,
};

describe('calculateComponentAbsolutePosition utils', () => {
    describe('without autoPositioning', () => {
        it('should keep initial TOP position and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top - DEFAULT_COMPONENT_SIZE.height);
            expect(position).toEqual(Position.TOP);
        });

        it('should keep initial TOP_LEFT position and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_LEFT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top - DEFAULT_COMPONENT_SIZE.height);
            expect(position).toEqual(Position.TOP_LEFT);
        });

        it('should keep initial TOP_RIGHT position and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_RIGHT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top - DEFAULT_COMPONENT_SIZE.height);
            expect(position).toEqual(Position.TOP_RIGHT);
        });

        it('should keep initial BOTTOM position and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height);
            expect(position).toEqual(Position.BOTTOM);
        });

        it('should keep initial BOTTOM_LEFT position and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_LEFT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height);
            expect(position).toEqual(Position.BOTTOM_LEFT);
        });

        it('should keep initial BOTTOM_RIGHT position and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_RIGHT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height);
            expect(position).toEqual(Position.BOTTOM_RIGHT);
        });

        it('should keep initial LEFT position and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {left} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.left).toBe(left - DEFAULT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.LEFT);
        });

        it('should keep initial LEFT_BOTTOM position and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_BOTTOM,
                PARENT_AT_THE_BOTTOM_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {left} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.left).toBe(left - DEFAULT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.LEFT_BOTTOM);
        });

        it('should keep initial LEFT_TOP position and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_TOP,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {left} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.left).toBe(left - DEFAULT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.LEFT_TOP);
        });

        it('should keep initial RIGHT position and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {right} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.left).toBe(right);
            expect(position).toEqual(Position.RIGHT);
        });

        it('should keep initial RIGHT_TOP position and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_TOP,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {right} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.left).toBe(right);
            expect(position).toEqual(Position.RIGHT_TOP);
        });

        it('should keep initial RIGHT_BOTTOM position and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_BOTTOM,
                PARENT_AT_THE_BOTTOM_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {right} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.left).toBe(right);
            expect(position).toEqual(Position.RIGHT_BOTTOM);
        });
    });

    describe('with autoPositioning', () => {
        it('should change position from TOP to BOTTOM and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {top, height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height);
            expect(position).toEqual(Position.BOTTOM);
        });

        it('should change position from TOP_LEFT to BOTTOM_LEFT and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_LEFT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {top, height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height);
            expect(position).toEqual(Position.BOTTOM_LEFT);
        });

        it('should change position from TOP_RIGHT to BOTTOM_RIGHT and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_RIGHT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {top, height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height);
            expect(position).toEqual(Position.BOTTOM_RIGHT);
        });

        it('should change position from BOTTOM to TOP and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM,
                PARENT_AT_THE_BOTTOM_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {top} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.top).toBe(top - DEFAULT_COMPONENT_SIZE.height);
            expect(position).toEqual(Position.TOP);
        });

        it('should change position from BOTTOM_LEFT to TOP_LEFT and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_LEFT,
                PARENT_AT_THE_BOTTOM_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {top} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.top).toBe(top - DEFAULT_COMPONENT_SIZE.height);
            expect(position).toEqual(Position.TOP_LEFT);
        });

        it('should change position from BOTTOM_RIGHT to TOP_RIGHT and calculate style for top value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_RIGHT,
                PARENT_AT_THE_BOTTOM_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {top} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.top).toBe(top - DEFAULT_COMPONENT_SIZE.height);
            expect(position).toEqual(Position.TOP_RIGHT);
        });

        it('should change position from LEFT to RIGHT and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {right} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.left).toBe(right);
            expect(position).toEqual(Position.RIGHT);
        });

        it('should change position from LEFT_TOP to RIGHT_TOP and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_TOP,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {right} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.left).toBe(right);
            expect(position).toEqual(Position.RIGHT_TOP);
        });

        it('should change position from LEFT_BOTTOM to RIGHT_BOTTOM and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_BOTTOM,
                PARENT_AT_THE_BOTTOM_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {right} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.left).toBe(right);
            expect(position).toEqual(Position.RIGHT_BOTTOM);
        });

        it('should change position from RIGHT to LEFT and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {left} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.left).toBe(left - DEFAULT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.LEFT);
        });

        it('should change position from RIGHT_BOTTOM to LEFT_BOTTOM and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_BOTTOM,
                PARENT_AT_THE_BOTTOM_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {left} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.left).toBe(left - DEFAULT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.LEFT_BOTTOM);
        });

        it('should change position from RIGHT_TOP to LEFT_TOP and calculate style for left value correctly', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_TOP,
                PARENT_AT_THE_TOP_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {left} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.left).toBe(left - DEFAULT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.LEFT_TOP);
        });
    });

    describe('calculate styles for left or top, depends on the position', () => {
        it('should calculate style for left if pass TOP position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {left, width} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.left).toBe(left + (width / 2) - (DEFAULT_COMPONENT_SIZE.width / 2));
            expect(position).toEqual(Position.TOP);
        });

        it('should calculate style for left if pass BOTTOM position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {left, width} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.left).toBe(left + (width / 2) - (DEFAULT_COMPONENT_SIZE.width / 2));
            expect(position).toEqual(Position.BOTTOM);
        });

        it('should calculate style for left if pass BOTTOM_LEFT position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_LEFT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {left} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.left).toBe(left);
            expect(position).toEqual(Position.BOTTOM_LEFT);
        });

        it('should calculate style for left if pass TOP_LEFT position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_LEFT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {left} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.left).toBe(left);
            expect(position).toEqual(Position.TOP_LEFT);
        });

        it('should calculate style for left if pass TOP_RIGHT position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_RIGHT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {right} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.left).toBe(right - DEFAULT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.TOP_RIGHT);
        });

        it('should calculate style for left if pass BOTTOM_RIGHT position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_RIGHT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {right} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.left).toBe(right - DEFAULT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.BOTTOM_RIGHT);
        });

        it('should calculate style for top if pass LEFT position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, height} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.top).toBe(top + (height / 2) - (DEFAULT_COMPONENT_SIZE.height / 2));
            expect(position).toEqual(Position.LEFT);
        });

        it('should calculate style for top if pass RIGHT position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, height} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.top).toBe(top + (height / 2) - (DEFAULT_COMPONENT_SIZE.height / 2));
            expect(position).toEqual(Position.RIGHT);
        });

        it('should calculate style for top if pass LEFT_TOP position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_TOP,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.top).toBe(top);
            expect(position).toEqual(Position.LEFT_TOP);
        });

        it('should calculate style for top if pass RIGHT_TOP position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_TOP,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.top).toBe(top);
            expect(position).toEqual(Position.RIGHT_TOP);
        });

        it('should calculate style for top if pass LEFT_BOTTOM position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_BOTTOM,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, height} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height - DEFAULT_COMPONENT_SIZE.height);
            expect(position).toEqual(Position.LEFT_BOTTOM);
        });

        it('should calculate style for top if pass RIGHT_BOTTOM position', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_BOTTOM,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, height} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height - DEFAULT_COMPONENT_SIZE.height);
            expect(position).toEqual(Position.RIGHT_BOTTOM);
        });
    });

    describe('calculate styles for arrow', () => {
        it('should calculate style for arrow position if pass TOP_LEFT position and component width more than parent width', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_LEFT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                ARROW_SIZE,
                true,
            );

            const {width} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(width).toBeLessThan(DEFAULT_COMPONENT_SIZE.width);
            expect(arrowPosition.right).toBeUndefined();
            expect(arrowPosition.left).toBe(width / 2);
            expect(position).toEqual(Position.TOP_LEFT);
        });

        it('should calculate style for arrow position if pass BOTTOM_LEFT position and component width more than parent width', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_LEFT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                ARROW_SIZE,
                true,
            );

            const {width} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(width).toBeLessThan(DEFAULT_COMPONENT_SIZE.width);
            expect(arrowPosition.right).toBeUndefined();
            expect(arrowPosition.left).toBe(width / 2);
            expect(position).toEqual(Position.BOTTOM_LEFT);
        });

        it('should calculate style for arrow position if pass TOP_RIGHT position and component width more than parent width', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_RIGHT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                ARROW_SIZE,
                true,
            );

            const {width} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(width).toBeLessThan(DEFAULT_COMPONENT_SIZE.width);
            expect(arrowPosition.left).toBeNull();
            expect(arrowPosition.right).toBe((width / 2) - (ARROW_SIZE.width / 2));
            expect(position).toEqual(Position.TOP_RIGHT);
        });

        it('should calculate style for arrow position if pass BOTTOM_RIGHT position and component width more than parent width', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_RIGHT,
                PARENT_AT_THE_CENTER_REF,
                DEFAULT_COMPONENT_SIZE,
                ARROW_SIZE,
                true,
            );

            const {width} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(width).toBeLessThan(DEFAULT_COMPONENT_SIZE.width);
            expect(arrowPosition.left).toBeNull();
            expect(arrowPosition.right).toBe((width / 2) - (ARROW_SIZE.width / 2));
            expect(position).toEqual(Position.BOTTOM_RIGHT);
        });

        it('should calculate style for arrow position if pass LEFT_TOP position and component height more than parent height', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_TOP,
                PARENT_AT_THE_CENTER_REF,
                LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE,
                ARROW_SIZE,
                true,
            );

            const {height} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(height).toBeLessThan(LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE.height);
            expect(arrowPosition.top).toBe(height / 2);
            expect(position).toEqual(Position.LEFT_TOP);
        });

        it('should calculate style for arrow position if pass RIGHT_TOP position and component height more than parent height', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_TOP,
                PARENT_AT_THE_CENTER_REF,
                LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE,
                ARROW_SIZE,
                true,
            );

            const {height} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            expect(height).toBeLessThan(LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE.height);
            expect(arrowPosition.top).toBe(height / 2);
            expect(position).toEqual(Position.RIGHT_TOP);
        });

        it('should calculate style for arrow position if pass RIGHT_BOTTOM position and component height more than parent height', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_BOTTOM,
                PARENT_AT_THE_BOTTOM_REF,
                LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE,
                ARROW_SIZE,
                true,
            );

            const {height} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(height).toBeLessThan(LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE.height);
            expect(arrowPosition.bottom).toBe((height / 2) - (ARROW_SIZE.height / 2));
            expect(position).toEqual(Position.RIGHT_BOTTOM);
        });

        it('should calculate style for arrow position if pass LEFT_BOTTOM position and component height more than parent height', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_BOTTOM,
                PARENT_AT_THE_BOTTOM_REF,
                LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE,
                ARROW_SIZE,
                true,
            );

            const {height} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(height).toBeLessThan(LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE.height);
            expect(arrowPosition.bottom).toBe((height / 2) - (ARROW_SIZE.height / 2));
            expect(position).toEqual(Position.LEFT_BOTTOM);
        });
    });

    describe('when positioning top/bottom component does not go beyond the page horizontally', () => {
        it('should change position from TOP_LEFT to the TOP_RIGHT if component go beyond the page horizontally', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_LEFT,
                PARENT_AT_THE_TOP_REF,
                LARGE_WIDTH_COMPONENT_SIZE,
                null,
                false,
            );

            const {right} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.right).toBe(MOCKED_DOCUMENT_BODY_CLIENT_WIDTH_VALUE - right);
            expect(position).toEqual(Position.TOP_RIGHT);
        });

        it('should set arrow position to the middle of parent width if component position is TOP_LEFT', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_LEFT,
                PARENT_AT_THE_TOP_REF,
                LARGE_WIDTH_COMPONENT_SIZE,
                ARROW_SIZE,
                false,
            );

            const {width} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(width).toBeLessThan(LARGE_WIDTH_COMPONENT_SIZE.width);
            expect(arrowPosition.left).toBeNull();
            expect(arrowPosition.right).toBe((width / 2) - (ARROW_SIZE.width / 2));
            expect(position).toEqual(Position.TOP_RIGHT);
        });

        it('should change position from TOP_RIGHT to the TOP_LEFT if component go beyond the page horizontally', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_RIGHT,
                PARENT_AT_THE_TOP_REF,
                LARGE_WIDTH_COMPONENT_SIZE,
                null,
                false,
            );

            const {left} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.right).toBeNull();
            expect(style.left).toBe(left);
            expect(position).toEqual(Position.TOP_LEFT);
        });

        it('should set arrow position to the middle of parent width if component position is TOP_RIGHT', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.TOP_RIGHT,
                PARENT_AT_THE_TOP_REF,
                LARGE_WIDTH_COMPONENT_SIZE,
                ARROW_SIZE,
                false,
            );

            const {left, width} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(left).toBeLessThan(LARGE_WIDTH_COMPONENT_SIZE.width);
            expect(arrowPosition.left).toBe(width / 2);
            expect(arrowPosition.right).toBeUndefined();
            expect(position).toEqual(Position.TOP_LEFT);
        });

        it('should change position from BOTTOM_LEFT to the BOTTOM_RIGHT if component go beyond the page horizontally', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_LEFT,
                PARENT_AT_THE_BOTTOM_REF,
                LARGE_WIDTH_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, right, height} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.left).toBeNull();
            expect(style.right).toBe(MOCKED_DOCUMENT_BODY_CLIENT_WIDTH_VALUE - right);
            expect(style.top).toBe(top + height);
            expect(position).toEqual(Position.BOTTOM_RIGHT);
        });

        it('should change position from BOTTOM_RIGHT to the BOTTOM_LEFT if component go beyond the page horizontally', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.BOTTOM_RIGHT,
                PARENT_AT_THE_BOTTOM_REF,
                LARGE_WIDTH_COMPONENT_SIZE,
                null,
                false,
            );

            const {left} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.right).toBeNull();
            expect(style.left).toBe(left);
            expect(position).toEqual(Position.BOTTOM_LEFT);
        });
    });

    describe('when positioning left/right component does not go beyond the page vertically', () => {
        it('should change position from RIGHT_BOTTOM to the RIGHT_TOP if component go beyond the page vertically', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_BOTTOM,
                PARENT_AT_THE_TOP_REF,
                LARGE_HEIGHT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top);
            expect(position).toEqual(Position.RIGHT_TOP);
        });

        it('should set arrow position to the middle of parent height if component position is RIGHT_BOTTOM', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_BOTTOM,
                PARENT_AT_THE_TOP_REF,
                LARGE_HEIGHT_COMPONENT_SIZE,
                ARROW_SIZE,
                false,
            );

            const {height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(height).toBeLessThan(LARGE_HEIGHT_COMPONENT_SIZE.height);
            expect(arrowPosition.left).toBeUndefined();
            expect(arrowPosition.top).toBe(height / 2);
            expect(position).toEqual(Position.RIGHT_TOP);
        });

        it('should change position from RIGHT_TOP to the RIGHT_BOTTOM if component go beyond the page vertically', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_TOP,
                PARENT_AT_THE_BOTTOM_REF,
                LARGE_HEIGHT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, height} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height - LARGE_HEIGHT_COMPONENT_SIZE.height);
            expect(position).toEqual(Position.RIGHT_BOTTOM);
        });

        it('should set arrow position to the middle of parent height if component position is RIGHT_TOP', () => {
            const {arrowPosition, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_TOP,
                PARENT_AT_THE_BOTTOM_REF,
                LARGE_HEIGHT_COMPONENT_SIZE,
                ARROW_SIZE,
                false,
            );

            const {height} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(height).toBeLessThan(LARGE_HEIGHT_COMPONENT_SIZE.height);
            expect(arrowPosition.top).toBeUndefined();
            expect(arrowPosition.bottom).toBe((height / 2) - (ARROW_SIZE.height / 2));
            expect(position).toEqual(Position.RIGHT_BOTTOM);
        });

        it('should change position from LEFT_BOTTOM to the LEFT_TOP if component go beyond the page vertically', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_BOTTOM,
                PARENT_AT_THE_TOP_REF,
                LARGE_HEIGHT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, left} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            expect(style.top).toBe(top);
            expect(style.left).toBe(left - LARGE_HEIGHT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.LEFT_TOP);
        });

        it('should change position from LEFT_TOP to the LEFT_BOTTOM if component go beyond the page vertically', () => {
            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_TOP,
                PARENT_AT_THE_BOTTOM_REF,
                LARGE_HEIGHT_COMPONENT_SIZE,
                null,
                false,
            );

            const {top, height, left} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            expect(style.top).toBe(top + height - LARGE_HEIGHT_COMPONENT_SIZE.height);
            expect(style.left).toBe(left - LARGE_HEIGHT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.LEFT_BOTTOM);
        });
    });
});
