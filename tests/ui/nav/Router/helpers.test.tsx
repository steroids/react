import '@testing-library/jest-dom';
import React from 'react';
import {walkRoutesRecursive, findRedirectPathRecursive, treeToList} from '../../../../src/ui/nav/Router/helpers';

describe('walkRoutesRecursive', () => {
    const mockItem = {
        id: 'home',
        exact: true,
        path: '/',
        label: 'Home',
        title: 'Homepage',
        isVisible: true,
        isNavVisible: true,
        layout: 'main',
        roles: ['user'],
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
                roles: ['user'],
                component: () => <div>About Us page</div>,
                componentProps: null,
            },
        ],
    };

    it('should normalize a route object recursively', () => {
        const normalizedRoute = walkRoutesRecursive(mockItem);

        expect(normalizedRoute.id).toBe('home');
        expect(normalizedRoute.exact).toBe(true);
        expect(normalizedRoute.path).toBe('/');
        expect(normalizedRoute.label).toBe('Home');
        expect(normalizedRoute.title).toBe('Homepage');
        expect(normalizedRoute.isVisible).toBe(true);
        expect(normalizedRoute.isNavVisible).toBe(true);
        expect(normalizedRoute.layout).toBe('main');
        expect(normalizedRoute.roles).toEqual(['user']);
        expect(normalizedRoute.component).toBeDefined();
        expect(normalizedRoute.componentProps).toBeNull();
        expect(normalizedRoute.items).toHaveLength(1);
        expect(normalizedRoute.items[0].id).toBe('about');
        expect(normalizedRoute.items[0].path).toBe('/about');
        expect(normalizedRoute.items[0].label).toBe('About Us');
        expect(normalizedRoute.items[0].title).toBe('About Us');
        expect(normalizedRoute.items[0].isVisible).toBe(true);
        expect(normalizedRoute.items[0].isNavVisible).toBe(true);
        expect(normalizedRoute.items[0].layout).toBe('main');
        expect(normalizedRoute.items[0].roles).toEqual(['user']);
        expect(normalizedRoute.items[0].component).toBeDefined();
        expect(normalizedRoute.items[0].componentProps).toBeNull();
    });
});

describe('findRedirectPathRecursive', () => {
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

describe('treeToList', () => {
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

    it('should flatten a tree with one level of nesting', () => {
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

    // it('should flatten a tree with multiple levels of nesting', () => {
    //     const input = {
    //         id: '1',
    //         path: '/path',
    //         items: [
    //             {
    //                 id: '2',
    //                 path: '/path2',
    //                 items: [
    //                     {id: '3', path: '/path3'},
    //                     {id: '4', path: '/path4'},
    //                 ],
    //             },
    //             {id: '5', path: '/path5'},
    //         ],
    //     };
    //     const result = treeToList(input);
    //     expect(result).toEqual([
    //         {id: '1', path: '/path'},
    //         {id: '2', path: '/path2'},
    //         {id: '3', path: '/path3'},
    //         {id: '4', path: '/path4'},
    //         {id: '5', path: '/path5'},
    //     ]);
    // });
});
