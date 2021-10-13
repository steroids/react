import 'jest-enzyme';
import React from 'react';
import {act} from 'react-dom/test-utils';
import ButtonView from '@steroidsjs/bootstrap/form/Button/ButtonView';
import {IButtonProps} from './Button';
import mountWithApp from '../../../../tests/mountWithApp';

const Button = require('./Button').default;

describe('Button tests', () => {
    it('should render something without props', () => {
        const wrapper = mountWithApp(Button, {view: ButtonView});
        expect(wrapper).not.toBeEmptyRender();
    });

    describe('Static props', () => {
        const props: IButtonProps = {
            label: 'Button',
            // icon: 'foo', TODO: add test 'should render icon'
            type: 'button',
            color: 'warning',
            outline: true,
            style: {width: '120px'},
            className: 'test',
            disabled: true,
        };

        const wrapper = mountWithApp(Button, {...props, view: ButtonView});

        it('should static props transmitted unchanged', () => {
            expect(wrapper.find('Button')).toHaveProp(props);
        });
        it('should render label', () => {
            expect(wrapper.find('.ButtonView__label')).toHaveText(props.label);
        });

        it('should have right type', () => {
            expect(wrapper.find('button')).toHaveProp('type', props.type);
        });
        it('should have right color modifier', () => {
            expect(wrapper.find('button')).not.toHaveClassName(`ButtonView_color_${props.color}`);
            expect(wrapper.find('button')).toHaveClassName(`ButtonView_outline_${props.color}`);
        });
        it('should have right outline modifier', () => {
            expect(wrapper.find('button')).toHaveClassName('ButtonView_outline');
        });
        it('should have right external className', () => {
            expect(wrapper.find('button')).toHaveClassName(props.className);
        });
        it('should have right external style', () => {
            expect(wrapper.find('button')).toHaveProp('style', props.style);
        });
        it('should be disabled ', () => {
            expect(wrapper.find('button')).toBeDisabled();
        });
    });

    describe('Conditional props', () => {
        it('should render "a" tag with props tag', () => {
            const wrapper = mountWithApp(Button, {tag: 'a', view: ButtonView});
            expect(wrapper.find('a')).toExist();
        });

        it('should render "a" tag with props url', () => {
            const wrapper = mountWithApp(Button, {url: 'https://ya.ru', view: ButtonView});
            expect(wrapper.find('a')).toExist();
        });

        it('should render "a" tag with props link', () => {
            const wrapper = mountWithApp(Button, {link: true, view: ButtonView});
            expect(wrapper.find('a')).toExist();
        });
    });

    describe('Actions', () => {
        const asyncClick = jest.fn(() => new Promise<void>(res => {
            setTimeout(() => res(), 3000);
        }));

        const flushPromises = () => new Promise(setImmediate);

        it('should isLoading toggling when onClick return Promise', async () => {
            const wrapper = mountWithApp(Button, {onClick: asyncClick, view: ButtonView});
            jest.useFakeTimers();

            expect(wrapper.find('.ButtonView').hasClass('ButtonView_loading')).toBeFalsy();

            wrapper.find('button').simulate('click');

            expect(asyncClick).toBeCalled();
            expect(asyncClick).toHaveBeenCalledTimes(1);
            expect(wrapper.find('.ButtonView').hasClass('ButtonView_loading')).toBeTruthy();

            await act(async () => {
                jest.runAllTimers(); //resolve onClick promise
                await flushPromises(); //wait until pending promises are resolved
                jest.runAllTimers(); //skip setTimeout after .then
                wrapper.update();

                expect(wrapper.find('.ButtonView').hasClass('ButtonView_loading')).toBeFalsy();
            });
        });
    });
});
