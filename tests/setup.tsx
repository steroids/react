/* eslint-disable import/no-extraneous-dependencies */
import 'jest-enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {configure} from 'enzyme';

configure({adapter: new Adapter()});
global.__ = (phrase: string, params?: any) => phrase;
