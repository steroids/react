/* eslint-disable import/no-extraneous-dependencies */
import 'jest-enzyme';
import {configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({adapter: new Adapter()});
