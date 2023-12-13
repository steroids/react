import '@testing-library/jest-dom';
import * as React from 'react';
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

    it('if the isVisible and isNavVisible fields are not set for the child element, then they are set as for the parent props', () => {
        const route = {isVisible: undefined, isNavVisible: undefined};
        const defaultItem = {};
        const parentItem = {isVisible: true, isNavVisible: false};
        const normalizedRoute = walkRoutesRecursive(route, defaultItem, parentItem);

        expect(normalizedRoute.isVisible).toBe(true);
        expect(normalizedRoute.isNavVisible).toBe(false);
    });

    it('normalization of the path if the path in the parent and child paths is passed', () => {
        const route = {path: 'about'};
        const defaultItem = {};
        const parentItem = {path: '/root'};
        const normalizedRoute = walkRoutesRecursive(route, defaultItem, parentItem);

        expect(normalizedRoute.path).toBe('/root/about');
    });

    it('should recursively normalize an object with an empty object', () => {
        const route = {};
        const normalizedRoute = walkRoutesRecursive(route);

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
        const normalizedRouteItem = normalizedRoute.items[0];
        const mockRoutesItem = mockRoutes.items[0];
        const itemsCount = 1;

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
        expect(normalizedRoute.items).toHaveLength(itemsCount);
        expect(normalizedRouteItem.id).toBe(mockRoutesItem.id);
        expect(normalizedRouteItem.path).toBe(mockRoutesItem.path);
        expect(normalizedRouteItem.label).toBe(mockRoutesItem.label);
        expect(normalizedRouteItem.title).toBe(mockRoutesItem.title);
        expect(normalizedRouteItem.isVisible).toBe(mockRoutesItem.isVisible);
        expect(normalizedRouteItem.isNavVisible).toBe(mockRoutesItem.isNavVisible);
        expect(normalizedRouteItem.layout).toBe(mockRoutesItem.layout);
        expect(normalizedRouteItem.roles).toEqual(mockRoutesItem.roles);
        expect(normalizedRouteItem.component).toBeDefined();
        expect(normalizedRouteItem.componentProps).toBeNull();
    });

    it('should normalize object recursively with defaultItem/parentItem', () => {
        const route = {};
        const defaultItem = {roles: ['admin'], layout: 'test-second', test: 'second-test', isVisible: false, isNavVisible: false};
        const parentItem = {roles: ['user'], layout: 'test-first', test: 'first-test'};
        const normalizedRoute = walkRoutesRecursive(route, defaultItem, parentItem);

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
        const emptyRoute = {};
        expect(findRedirectPathRecursive(emptyRoute)).toBeNull();
    });

    it('returns the first nested route path when passed an object with redirectTo equal to true', () => {
        const nestedPath = '/nested-route';
        const anotherNestedPath = '/another-nested-route';
        const route = {
            redirectTo: true,
            items: [
                {path: nestedPath},
                {path: anotherNestedPath},
            ],
        };
        const redirectPath = findRedirectPathRecursive(route);
        expect(redirectPath).toEqual(nestedPath);
    });

    it('returns the redirectTo path when passed an object with redirectTo equal to a string', () => {
        const redirectPath = '/redirect-path';
        const route = {redirectTo: redirectPath};
        expect(findRedirectPathRecursive(route)).toBe(redirectPath);
    });

    it('returns the path when passed an object with path equal to a string', () => {
        const somePath = '/some-path';
        const route = {path: somePath};
        expect(findRedirectPathRecursive(route)).toBe(somePath);
    });

    it('returns empty string when passed an object with path equal to an empty string', () => {
        const emptyPath = '';
        const route = {path: emptyPath};
        expect(findRedirectPathRecursive(route)).toBe(emptyPath);
    });

    it('returns null value when passing an object without a path', () => {
        const routeWithoutPath = {id: '1'};
        expect(findRedirectPathRecursive(routeWithoutPath)).toBeNull();
    });
});

describe('Function treeToList', () => {
    describe('with absolute paths ', () => {
        it('should get a leaf from a tree with one level of nesting', () => {
            const tree = {
                id: '1',
                path: '/path',
                items: [
                    {id: '2', path: '/path2'},
                    {id: '3', path: '/path3'},
                ],
            };
            const expectedList = [
                {id: '1', path: '/path', items: [{id: '2', path: '/path2'}, {id: '3', path: '/path3'}]},
                {id: '2', path: '/path2'},
                {id: '3', path: '/path3'},
            ];

            const list = treeToList(tree, true, {}, false);
            expect(list).toEqual(expectedList);
        });

        it('should get a leaf from a tree with several levels of nesting', () => {
            const tree = {
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
            const expectedList = [
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
            ];

            const list = treeToList(tree, true, {}, false);
            expect(list).toEqual(expectedList);
        });
    });

    describe('with nested paths ', () => {
        it('should return an empty array for an empty tree', () => {
            const tree = [];
            const list = treeToList(tree);
            const expectedList = [];
            expect(list).toEqual(expectedList);
        });

        it('should convert a single item to an empty array if he dont have path', () => {
            const tree = {id: '1'};
            const list = treeToList(tree);
            const expectedList = [];
            expect(list).toEqual(expectedList);
        });

        it('should convert a single item to an array if he have path', () => {
            const tree = {id: '1', path: '/path'};
            const list = treeToList(tree);
            const expectedList = [tree];
            expect(list).toEqual(expectedList);
        });

        it('should get a leaf from a tree with one level of nesting', () => {
            const tree = {
                id: '1',
                path: '/path',
                items: [
                    {id: '2', path: '/path2'},
                    {id: '3', path: '/path3'},
                ],
            };
            const expectedList = [
                {id: '1', path: '/path', items: [{id: '2', path: '/path/path2'}, {id: '3', path: '/path/path3'}]},
                {id: '2', path: '/path/path2'},
                {id: '3', path: '/path/path3'},
            ];

            const list = treeToList(tree);
            expect(list).toEqual(expectedList);
        });

        it('should add root item with id "root" when isRoot is true and item.id is falsy', () => {
            const tree = {path: '/path'};
            const list = treeToList(tree);
            expect(list[0].id).toBe('root');
        });

        it('should get a leaf from a tree with several levels of nesting', () => {
            const tree = {
                id: '1',
                path: '/path',
                items: [
                    {
                        id: '2',
                        path: 'path2',
                        items: [{id: '3', path: 'path3'}, {id: '4', path: 'path4'}],
                    },
                    {id: '5', path: 'path5'},
                ],
            };
            const expectedList = [
                {
                    id: '1',
                    path: '/path',
                    items: [
                        {
                            id: '2',
                            path: '/path/path2',
                            items: [{id: '3', path: '/path/path2/path3'}, {id: '4', path: '/path/path2/path4'}],
                        },
                        {id: '5', path: '/path/path5'},
                    ],
                },
                {
                    id: '2',
                    path: '/path/path2',
                    items: [{id: '3', path: '/path/path2/path3'}, {id: '4', path: '/path/path2/path4'}],
                },
                {id: '3', path: '/path/path2/path3'},
                {id: '4', path: '/path/path2/path4'},
                {id: '5', path: '/path/path5'},
            ];

            const list = treeToList(tree);
            expect(list).toEqual(expectedList);
        });
    });
});
