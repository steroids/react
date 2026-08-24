/* eslint-disable import/no-extraneous-dependencies */
import 'jest-enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {configure} from 'enzyme';

import {TextDecoder, TextEncoder} from 'util';

global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

configure({
    adapter: new Adapter(),
});
global.__ = (phrase: string, params?: any) => phrase;
