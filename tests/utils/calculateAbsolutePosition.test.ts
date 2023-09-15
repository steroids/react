import {Positions} from '../../src/hooks/useAbsolutePositioning';
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

const GAP = 10;

const DEFAULT_PARENT_REF = {
    getBoundingClientRect: () => ({
        top: 80,
        left: 10,
        width: 160,
        height: 40,
    }),
};

const DEFAULT_COMPONENT_SIZE = {
    height: 90,
    width: 200,
};

/*
* @Todo + add test cases for arrowPosition
* */

describe('calculate utils', () => {
    it('should calculate position value for the top style correctly', () => {
        const result = calculateComponentAbsolutePosition(GAP, Positions.TOP, DEFAULT_PARENT_REF, DEFAULT_COMPONENT_SIZE);

        const {top, height} = DEFAULT_PARENT_REF.getBoundingClientRect();

        expect(result.style.top).toBe(MOCKED_WINDOW_SCROLL_Y_VALUE + top + height);
    });

    it('should calculate the left style value when position is TOP DONE', () => {
        const componentSize = {
            height: 20,
            width: 80,
        };

        const result = calculateComponentAbsolutePosition(GAP, Positions.TOP, DEFAULT_PARENT_REF, componentSize);

        const {left, width} = DEFAULT_PARENT_REF.getBoundingClientRect();

        expect(result.style.left).toBe(left + (width / 2) - (componentSize.width / 2));
    });

    it('should calculate the left style value when position is TOP_LEFT DONE', () => {
        const result = calculateComponentAbsolutePosition(GAP, Positions.TOP_LEFT, DEFAULT_PARENT_REF, DEFAULT_COMPONENT_SIZE);

        const {left} = DEFAULT_PARENT_REF.getBoundingClientRect();

        expect(result.style.left).toBe(left);
    });

    it('should calculate the left style value when position is TOP_RIGHT DONE', () => {
        const parentRef = {
            getBoundingClientRect: () => ({
                top: 80,
                right: 300,
                width: 320,
                height: 40,
            }),
        };

        const result = calculateComponentAbsolutePosition(GAP, Positions.TOP_RIGHT, parentRef, DEFAULT_COMPONENT_SIZE);

        const {right} = parentRef.getBoundingClientRect();

        expect(result.style.left).toBe(right - DEFAULT_COMPONENT_SIZE.width);
    });

    it('should calculate the top style value when position is LEFT DONE', () => {
        const result = calculateComponentAbsolutePosition(GAP, Positions.LEFT, DEFAULT_PARENT_REF, DEFAULT_COMPONENT_SIZE);

        const {top, height} = DEFAULT_PARENT_REF.getBoundingClientRect();

        expect(result.style.top).toBe(top + (height / 2) - (DEFAULT_COMPONENT_SIZE.height / 2));
    });

    it('should calculate the top style value when position is LEFT_TOP DONE', () => {
        const result = calculateComponentAbsolutePosition(GAP, Positions.LEFT_TOP, DEFAULT_PARENT_REF, DEFAULT_COMPONENT_SIZE);

        const {top} = DEFAULT_PARENT_REF.getBoundingClientRect();

        expect(result.style.top).toBe(top);
    });

    it('should calculate the top style value when position is LEFT_BOTTOM DONE', () => {
        const result = calculateComponentAbsolutePosition(GAP, Positions.LEFT_BOTTOM, DEFAULT_PARENT_REF, DEFAULT_COMPONENT_SIZE);

        const {top, height} = DEFAULT_PARENT_REF.getBoundingClientRect();

        expect(result.style.top).toBe(top + height - DEFAULT_COMPONENT_SIZE.height);
    });

    it('should change position from top to the bottom correctly', () => {
        const result = calculateComponentAbsolutePosition(GAP, Positions.TOP, DEFAULT_PARENT_REF, DEFAULT_COMPONENT_SIZE);

        expect(result.position).toBe(Positions.BOTTOM);
    });

    it('should change position from bottom to the top correctly', () => {
        const componentSize = {
            height: 570,
            width: 200,
        };

        const result = calculateComponentAbsolutePosition(GAP, Positions.BOTTOM, DEFAULT_PARENT_REF, componentSize);

        expect(result.position).toBe(Positions.TOP);
    });

    it('should change position from left to the right correctly DONE', () => {
        const result = calculateComponentAbsolutePosition(GAP, Positions.LEFT, DEFAULT_PARENT_REF, DEFAULT_COMPONENT_SIZE);

        expect(result.position).toBe(Positions.RIGHT);
    });

    it('should change position from right to the left correctly DONE', () => {
        const parentRef = {
            getBoundingClientRect: () => ({
                top: 80,
                right: 10,
                width: 320,
                height: 40,
            }),
        };

        const componentSize = {
            height: 90,
            width: 360,
        };

        const result = calculateComponentAbsolutePosition(GAP, Positions.RIGHT, parentRef, componentSize);

        expect(result.position).toBe(Positions.LEFT);
    });

    it('should set parent left value when tooltip calculated value less than 0', () => {
        const result = calculateComponentAbsolutePosition(GAP, Positions.TOP, DEFAULT_PARENT_REF, DEFAULT_COMPONENT_SIZE);

        expect(result.style.left).toBe(DEFAULT_PARENT_REF.getBoundingClientRect().left);
    });
});
