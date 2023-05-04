import '@testing-library/jest-dom';
import React from 'react';
import {walkRoutesRecursive, findRedirectPathRecursive, treeToList} from '../../../../src/ui/nav/Router/helpers';

describe('Function walkRoutesRecursive', () => {
    const mockRoutes = {
        id: 'home',
        exact: true,
        path: '/',
        label: 'Home',
        title: 'Homepage',
        isVisible: true,
        isNavVisible: true,
        layout: 'main',
        roles: ['admin'],
        component: () => <div>Home page</div>,
        componentProps: null,
        items: [
            {
                id: 'about',
                path: '/about',
                label: 'About Us',
                title: 'About Us',
                isVisible: true,
                isNavVisible: true,
                layout: 'main',
                roles: ['admin', 'user'],
                component: () => <div>About Us page</div>,
                componentProps: null,
            },
        ],
    };

    it('should recursively normalize an object with an empty object', () => {
        const item = {};
        const normalizedRoute = walkRoutesRecursive(item);
        expect(normalizedRoute.id).toBeUndefined();
        expect(normalizedRoute.exact).toBeUndefined();
        expect(normalizedRoute.path).toBeUndefined();
        expect(normalizedRoute.label).toBeUndefined();
        expect(normalizedRoute.title).toBeUndefined();
        expect(normalizedRoute.isVisible).toBeUndefined();
        expect(normalizedRoute.isNavVisible).toBeUndefined();
        expect(normalizedRoute.layout).toBeNull();
        expect(normalizedRoute.roles).toBeNull();
        expect(normalizedRoute.component).toBeNull();
        expect(normalizedRoute.componentProps).toBeNull();
    });

    it('should normalize the object and items recursively without defaultItem/parentItem', () => {
        const normalizedRoute = walkRoutesRecursive(mockRoutes);

        expect(normalizedRoute.id).toBe(mockRoutes.id);
        expect(normalizedRoute.exact).toBe(mockRoutes.exact);
        expect(normalizedRoute.path).toBe(mockRoutes.path);
        expect(normalizedRoute.label).toBe(mockRoutes.label);
        expect(normalizedRoute.title).toBe(mockRoutes.title);
        expect(normalizedRoute.isVisible).toBe(mockRoutes.isVisible);
        expect(normalizedRoute.isNavVisible).toBe(mockRoutes.isNavVisible);
        expect(normalizedRoute.layout).toBe(mockRoutes.layout);
        expect(normalizedRoute.roles).toEqual(mockRoutes.roles);
        expect(normalizedRoute.component).toBeDefined();
        expect(normalizedRoute.componentProps).toBeNull();
        expect(normalizedRoute.items).toHaveLength(1);
        expect(normalizedRoute.items[0].id).toBe(mockRoutes.items[0].id);
        expect(normalizedRoute.items[0].path).toBe(mockRoutes.items[0].path);
        expect(normalizedRoute.items[0].label).toBe(mockRoutes.items[0].label);
        expect(normalizedRoute.items[0].title).toBe(mockRoutes.items[0].title);
        expect(normalizedRoute.items[0].isVisible).toBe(mockRoutes.items[0].isVisible);
        expect(normalizedRoute.items[0].isNavVisible).toBe(mockRoutes.items[0].isNavVisible);
        expect(normalizedRoute.items[0].layout).toBe(mockRoutes.items[0].layout);
        expect(normalizedRoute.items[0].roles).toEqual(mockRoutes.items[0].roles);
        expect(normalizedRoute.items[0].component).toBeDefined();
        expect(normalizedRoute.items[0].componentProps).toBeNull();
    });

    it('should normalize object recursively with defaultItem/parentItem', () => {
        const defaultItem = {roles: ['admin'], layout: 'test-second', test: 'second-test', isVisible: false, isNavVisible: false};
        const parentItem = {roles: ['user'], layout: 'test-first', test: 'first-test'};
        const normalizedRoute = walkRoutesRecursive({}, defaultItem, parentItem);

        expect(normalizedRoute.roles).toBe(parentItem.roles);
        expect(normalizedRoute.roles).not.toBe(defaultItem.roles);

        expect(normalizedRoute.layout).toBe(parentItem.layout);
        expect(normalizedRoute.roles).not.toBe(defaultItem.layout);

        expect(normalizedRoute.isVisible).toBe(defaultItem.isVisible);
        expect(normalizedRoute.isNavVisible).toBe(defaultItem.isNavVisible);
    });
});

describe('Function findRedirectPathRecursive', () => {
    it('returns null when passed an empty object', () => {
        expect(findRedirectPathRecursive({})).toBeNull();
    });

    it('returns the first nested route path when passed an object with redirectTo equal to true', () => {
        const route = {
            redirectTo: true,
            items: [
                {path: '/nested-route'},
                {path: '/another-nested-route'},
            ],
        };
        const result = findRedirectPathRecursive(route);
        expect(result).toEqual('/nested-route');
    });

    it('returns the redirectTo path when passed an object with redirectTo equal to a string', () => {
        const route = {redirectTo: '/redirect-path'};
        expect(findRedirectPathRecursive(route)).toBe('/redirect-path');
    });

    it('returns the path when passed an object with path equal to a string', () => {
        const route = {path: '/some-path'};
        expect(findRedirectPathRecursive(route)).toBe('/some-path');
    });

    it('returns empty string when passed an object with path equal to an empty string', () => {
        const route = {path: ''};
        expect(findRedirectPathRecursive(route)).toBe('');
    });

    it('returns null value when passing an object without a path', () => {
        const route = {items: []};
        expect(findRedirectPathRecursive(route)).toBeNull();
    });
});

describe('Function treeToList', () => {
    it('should return an empty array for an empty input', () => {
        const input = [];
        const result = treeToList(input);
        expect(result).toEqual([]);
    });

    it('should convert a single item to an empty array if he dont have path', () => {
        const input = {id: '1'};
        const result = treeToList(input);
        expect(result).toEqual([]);
    });

    it('should convert a single item to an array if he have path', () => {
        const input = {id: '1', path: '/path'};
        const result = treeToList(input);
        expect(result).toEqual([input]);
    });

    it('should get a leaf from a tree with one level of nesting', () => {
        const input = {
            id: '1',
            path: '/path',
            items: [
                {id: '2', path: '/path2'},
                {id: '3', path: '/path3'},
            ],
        };
        const result = treeToList(input);
        expect(result).toEqual([
            {id: '1', path: '/path', items: [{id: '2', path: '/path2'}, {id: '3', path: '/path3'}]},
            {id: '2', path: '/path2'},
            {id: '3', path: '/path3'},
        ]);
    });

    it('should add root item with id "root" when isRoot is true and item.id is falsy', () => {
        const input = {path: '/path'};
        const result = treeToList(input);
        expect(result[0].id).toBe('root');
    });

    it('should get a leaf from a tree with several levels of nesting', () => {
        const input = {
            id: '1',
            path: '/path',
            items: [
                {
                    id: '2',
                    path: '/path2',
                    items: [{id: '3', path: '/path3'}, {id: '4', path: '/path4'}],
                },
                {id: '5', path: '/path5'},
            ],
        };
        const result = treeToList(input);
        expect(result).toEqual([
            {
                id: '1',
                path: '/path',
                items: [
                    {
                        id: '2',
                        path: '/path2',
                        items: [{id: '3', path: '/path3'}, {id: '4', path: '/path4'}],
                    },
                    {id: '5', path: '/path5'},
                ],
            },
            {
                id: '2',
                path: '/path2',
                items: [{id: '3', path: '/path3'}, {id: '4', path: '/path4'}],
            },
            {id: '3', path: '/path3'},
            {id: '4', path: '/path4'},
            {id: '5', path: '/path5'},
        ]);
    });
});
