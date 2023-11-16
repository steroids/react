import {Position} from '../../src/hooks/useAbsolutePositioning';
import calculateComponentAbsolutePosition from '../../src/utils/calculateComponentAbsolutePosition';

const MOCKED_WINDOW_SCROLL_Y_VALUE = 0;
const MOCKED_DOCUMENT_BODY_CLIENT_WIDTH_VALUE = 375;
const MOCKED_WINDOW_INNER_HEIGHT_VALUE = 667;

let originalWindowScrollY: number;
let originalDocumentBodyClientWidth: number;
let originalWindowInnerHeight: number;

beforeEach(() => {
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
            const testCases = [
                Position.TOP,
                Position.TOP_LEFT,
                Position.TOP_RIGHT,
            ];

            const {top} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            const expectedStyle = {
                top: top - DEFAULT_COMPONENT_SIZE.height,
            };

            testCases.forEach((testingPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_TOP_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.top).toBe(expectedStyle.top);
                expect(position).toEqual(testingPosition);
            });
        });

        it('should keep initial BOTTOM position and calculate style for top value correctly', () => {
            const bottomPositions = [
                Position.BOTTOM,
                Position.BOTTOM_LEFT,
                Position.BOTTOM_RIGHT,
            ];

            const {top, height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            const expectedStyle = {
                top: top + height,
            };

            bottomPositions.forEach((bottomPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    bottomPosition,
                    PARENT_AT_THE_TOP_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.top).toBe(expectedStyle.top);
                expect(position).toEqual(bottomPosition);
            });
        });

        it('should keep initial LEFT position and calculate style for left value correctly', () => {
            const leftPositions = [
                Position.LEFT,
                Position.LEFT_TOP,
            ];

            const {left} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            const expectedStyle = {
                left: left - DEFAULT_COMPONENT_SIZE.width,
            };

            leftPositions.forEach((leftPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    leftPosition,
                    PARENT_AT_THE_TOP_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.left).toBe(expectedStyle.left);
                expect(position).toEqual(leftPosition);
            });
        });

        it('should keep initial LEFT_BOTTOM position and calculate style for left value correctly', () => {
            const {left} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();
            const expectedStyle = {
                left: left - DEFAULT_COMPONENT_SIZE.width,
            };

            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.LEFT_BOTTOM,
                PARENT_AT_THE_BOTTOM_REF,
                DEFAULT_COMPONENT_SIZE,
                null,
                false,
            );

            expect(style.left).toBe(expectedStyle.left);
            expect(position).toEqual(Position.LEFT_BOTTOM);
        });

        it('should keep initial RIGHT position and calculate style for left value correctly', () => {
            const rightPositions = [
                Position.RIGHT,
                Position.RIGHT_TOP,
            ];

            const {right} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            const expectedStyle = {
                left: right,
            };

            rightPositions.forEach((rightPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    rightPosition,
                    PARENT_AT_THE_TOP_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.left).toBe(expectedStyle.left);
                expect(position).toEqual(rightPosition);
            });
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
            const changingPositions = [
                [Position.TOP, Position.BOTTOM],
                [Position.TOP_LEFT, Position.BOTTOM_LEFT],
                [Position.TOP_RIGHT, Position.BOTTOM_RIGHT],
            ];

            const {top, height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            const expectedStyle = {
                top: top + height,
            };

            changingPositions.forEach(([initialPosition, resultPosition]) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    initialPosition,
                    PARENT_AT_THE_TOP_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    true,
                );

                expect(style.top).toEqual(expectedStyle.top);
                expect(position).toEqual(resultPosition);
            });
        });

        it('should change position from BOTTOM to TOP and calculate style for top value correctly', () => {
            const changingPositions = [
                [Position.BOTTOM, Position.TOP],
                [Position.BOTTOM_LEFT, Position.TOP_LEFT],
                [Position.BOTTOM_RIGHT, Position.TOP_RIGHT],
            ];

            const {top} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            const expectedStyle = {
                top: top - DEFAULT_COMPONENT_SIZE.height,
            };

            changingPositions.forEach(([initialPosition, resultPosition]) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    initialPosition,
                    PARENT_AT_THE_BOTTOM_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    true,
                );

                expect(style.top).toBe(expectedStyle.top);
                expect(position).toEqual(resultPosition);
            });
        });

        it('should change position from left/right to BOTTOM when component is beyond left/right', () => {
            const testCases = [
                Position.LEFT,
                Position.LEFT_TOP,
                Position.LEFT_BOTTOM,
                Position.RIGHT,
                Position.RIGHT_TOP,
                Position.RIGHT_BOTTOM,
            ];

            const {top, left, width, height} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            const expectedStyle = {
                left: (left + (width / 2)) - (DEFAULT_COMPONENT_SIZE.width / 2),
                top: top + height,
            };

            testCases.forEach((testingPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_TOP_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    true,
                );

                expect(style.left).toBe(expectedStyle.left);
                expect(style.top).toBe(expectedStyle.top);
                expect(position).toEqual(Position.BOTTOM);
            });
        });
    });

    describe('with autoPositioning and left/right position', () => {
        beforeEach(() => {
            Object.defineProperty(global.document.body, 'clientWidth', {
                value: 1024,
                writable: true,
            });
        });

        afterAll(() => {
            Object.defineProperty(global.document.body, 'clientWidth', {
                value: originalDocumentBodyClientWidth,
            });
        });

        it('should change position from LEFT to RIGHT and calculate style for left value correctly', () => {
            const changingPositions = [
                [Position.LEFT, Position.RIGHT],
                [Position.LEFT_TOP, Position.RIGHT_TOP],
            ];

            const {right} = PARENT_AT_THE_TOP_REF.getBoundingClientRect();

            changingPositions.forEach(([initialPosition, resultPosition]) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    initialPosition,
                    PARENT_AT_THE_TOP_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    true,
                );

                expect(style.left).toBe(right);
                expect(position).toEqual(resultPosition);
            });
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
            const parentAtTheTopRightRef = {
                getBoundingClientRect: () => ({
                    top: 61,
                    left: 614,
                    right: 1014,
                    width: 179,
                    height: 42,
                }),
            };

            const changingPositions = [
                [Position.RIGHT, Position.LEFT],
                [Position.RIGHT_TOP, Position.LEFT_TOP],
            ];

            const {left} = parentAtTheTopRightRef.getBoundingClientRect();

            const expectedStyle = {
                left: left - DEFAULT_COMPONENT_SIZE.width,
            };

            changingPositions.forEach(([initialPosition, resultPosition]) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    initialPosition,
                    parentAtTheTopRightRef,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    true,
                );

                expect(style.left).toEqual(expectedStyle.left);
                expect(position).toEqual(resultPosition);
            });
        });

        it('should change position from RIGHT_BOTTOM to LEFT_BOTTOM and calculate style for left value correctly', () => {
            const parentAtTheBottomRef = {
                getBoundingClientRect: () => ({
                    top: 497,
                    left: 614,
                    right: 1014,
                    width: 179,
                    height: 42,
                }),
            };

            const {style, position} = calculateComponentAbsolutePosition(
                GAP,
                Position.RIGHT_BOTTOM,
                parentAtTheBottomRef,
                DEFAULT_COMPONENT_SIZE,
                null,
                true,
            );

            const {left} = parentAtTheBottomRef.getBoundingClientRect();

            expect(style.left).toBe(left - DEFAULT_COMPONENT_SIZE.width);
            expect(position).toEqual(Position.LEFT_BOTTOM);
        });
    });

    describe('calculate styles for left or top, depends on the position', () => {
        it('should calculate style for left if pass TOP/BOTTOM position', () => {
            const testCases = [
                Position.TOP,
                Position.BOTTOM,
            ];

            const {left, width} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            const expectedStyle = {
                left: left + (width / 2) - (DEFAULT_COMPONENT_SIZE.width / 2),
            };

            testCases.forEach((testingPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_CENTER_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.left).toEqual(expectedStyle.left);
                expect(position).toEqual(testingPosition);
            });
        });

        it('should calculate style for left if pass BOTTOM_LEFT/TOP_LEFT position', () => {
            const testCases = [
                Position.BOTTOM_LEFT,
                Position.TOP_LEFT,
            ];

            const {left} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            testCases.forEach((testingPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_CENTER_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.left).toEqual(left);
                expect(position).toEqual(testingPosition);
            });
        });

        it('should calculate style for left if pass TOP_RIGHT/BOTTOM_RIGHT position', () => {
            const testCases = [
                Position.TOP_RIGHT,
                Position.BOTTOM_RIGHT,
            ];

            const {right} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            const expectedStyle = {
                left: right - DEFAULT_COMPONENT_SIZE.width,
            };

            testCases.forEach((testingPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_CENTER_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.left).toEqual(expectedStyle.left);
                expect(position).toEqual(testingPosition);
            });
        });

        it('should calculate style for top if pass LEFT/RIGHT position', () => {
            const testCases = [
                Position.LEFT,
                Position.RIGHT,
            ];

            const {top, height} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            const expectedStyle = {
                top: top + (height / 2) - (DEFAULT_COMPONENT_SIZE.height / 2),
            };

            testCases.forEach((testingPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_CENTER_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.top).toEqual(expectedStyle.top);
                expect(position).toEqual(testingPosition);
            });
        });

        it('should calculate style for top if pass LEFT_TOP/RIGHT_TOP position', () => {
            const testCases = [
                Position.LEFT_TOP,
                Position.RIGHT_TOP,
            ];

            const {top} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            testCases.forEach((testingPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_CENTER_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.top).toEqual(top);
                expect(position).toEqual(testingPosition);
            });
        });

        it('should calculate style for top if pass LEFT_BOTTOM/RIGHT_BOTTOM position', () => {
            const testCases = [
                Position.LEFT_BOTTOM,
                Position.RIGHT_BOTTOM,
            ];

            const {top, height} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            const expectedStyle = {
                top: top + height - DEFAULT_COMPONENT_SIZE.height,
            };

            testCases.forEach((testingPosition) => {
                const {style, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_CENTER_REF,
                    DEFAULT_COMPONENT_SIZE,
                    null,
                    false,
                );

                expect(style.top).toEqual(expectedStyle.top);
                expect(position).toEqual(testingPosition);
            });
        });
    });

    describe('calculate styles for arrow', () => {
        it('should calculate style for arrow position if pass TOP_LEFT/BOTTOM_LEFT position and component width more than parent width', () => {
            const testCases = [
                Position.TOP_LEFT,
                Position.BOTTOM_LEFT,
            ];

            const {width} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            const expectedArrowPosition = {
                left: width / 2,
            };

            testCases.forEach((testingPosition) => {
                const {arrowPosition, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_CENTER_REF,
                    DEFAULT_COMPONENT_SIZE,
                    ARROW_SIZE,
                    true,
                );

                expect(width).toBeLessThan(DEFAULT_COMPONENT_SIZE.width);
                expect(arrowPosition.right).toBeUndefined();
                expect(arrowPosition.left).toEqual(expectedArrowPosition.left);
                expect(position).toEqual(testingPosition);
            });
        });

        it('should calculate style for arrow position if pass TOP_RIGHT/BOTTOM_RIGHT position and component width more than parent width', () => {
            const testCases = [
                Position.TOP_RIGHT,
                Position.BOTTOM_RIGHT,
            ];

            const {width} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            const expectedArrowPosition = {
                left: null,
                right: (width / 2) - (ARROW_SIZE.width / 2),
            };

            testCases.forEach((testingPosition) => {
                const {arrowPosition, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_CENTER_REF,
                    DEFAULT_COMPONENT_SIZE,
                    ARROW_SIZE,
                    true,
                );

                expect(width).toBeLessThan(DEFAULT_COMPONENT_SIZE.width);
                expect(arrowPosition.left).toEqual(expectedArrowPosition.left);
                expect(arrowPosition.right).toEqual(expectedArrowPosition.right);
                expect(position).toEqual(testingPosition);
            });
        });

        it('should calculate style for arrow position if pass LEFT_TOP/RIGHT_TOP position and component height more than parent height', () => {
            const testCases = [
                Position.LEFT_TOP,
                Position.RIGHT_TOP,
            ];

            const {height} = PARENT_AT_THE_CENTER_REF.getBoundingClientRect();

            const expectedArrowPosition = {
                top: height / 2,
            };

            testCases.forEach((testingPosition) => {
                const {arrowPosition, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_CENTER_REF,
                    LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE,
                    ARROW_SIZE,
                    true,
                );

                expect(height).toBeLessThan(LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE.height);
                expect(arrowPosition.top).toEqual(expectedArrowPosition.top);
                expect(position).toEqual(testingPosition);
            });
        });

        it('should calculate style for arrow position if pass RIGHT_BOTTOM/LEFT_BOTTOM position and component height more than parent height', () => {
            const testCases = [
                Position.RIGHT_BOTTOM,
                Position.LEFT_BOTTOM,
            ];

            const {height} = PARENT_AT_THE_BOTTOM_REF.getBoundingClientRect();

            const expectedArrowPosition = {
                bottom: (height / 2) - (ARROW_SIZE.height / 2),
            };

            testCases.forEach((testingPosition) => {
                const {arrowPosition, position} = calculateComponentAbsolutePosition(
                    GAP,
                    testingPosition,
                    PARENT_AT_THE_BOTTOM_REF,
                    LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE,
                    ARROW_SIZE,
                    true,
                );

                expect(height).toBeLessThan(LARGE_HEIGHT_SMALL_WIDTH_COMPONENT_SIZE.height);
                expect(arrowPosition.bottom).toEqual(expectedArrowPosition.bottom);
                expect(position).toEqual(testingPosition);
            });
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
