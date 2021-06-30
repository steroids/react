import * as React from 'react';
import {PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {useMount, useUnmount} from 'react-use';

export interface IScreen {
    width: number,
    media: Record<string, any>,
    setMedia: any,
    isPhone: () => boolean,
    isTablet: () => boolean,
    isDesktop: () => boolean,
    getDeviceType: () => string
}

export const ScreenContext = React.createContext({} as IScreen);

export interface IScreenProviderProps extends PropsWithChildren<any> {
    media?: Record<string, any>,
    skipTimeout?: boolean
}

export const SCREEN_PHONE = 'phone';
export const SCREEN_TABLET = 'tablet';
export const SCREEN_DESKTOP = 'desktop';

export default function ScreenProvider(props: IScreenProviderProps): JSX.Element {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
    const [media, setMedia] = useState(props.media || {
        [SCREEN_PHONE]: 320,
        [SCREEN_TABLET]: 768,
        [SCREEN_DESKTOP]: 1024,
    });

    let timer = null;
    const onResize = () => {
        if (timer) {
            clearTimeout(timer);
        }
        if (props.skipTimeout) {
            setWidth(window.innerWidth);
        } else {
            timer = setTimeout(() => setWidth(window.innerWidth), 100);
        }
    };

    useMount(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', onResize, false);
        }
    });

    useUnmount(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', onResize);
        }
    });

    const getDeviceType = useCallback(() => {
        if (width < media[SCREEN_TABLET]) {
            return SCREEN_PHONE;
        }
        if (width < media[SCREEN_DESKTOP]) {
            return SCREEN_TABLET;
        }
        return SCREEN_DESKTOP;
    }, [width, media]);

    const isPhone = useCallback(() => getDeviceType() === SCREEN_PHONE, [getDeviceType]);
    const isTablet = useCallback(() => getDeviceType() === SCREEN_TABLET, [getDeviceType]);
    const isDesktop = useCallback(() => getDeviceType() === SCREEN_DESKTOP, [getDeviceType]);

    const value = useMemo(() => ({
        width,
        media,
        setMedia,
        isPhone,
        isTablet,
        isDesktop,
        getDeviceType,
    }), [
        width,
        media,
        setMedia,
        isPhone,
        isTablet,
        isDesktop,
        getDeviceType,
    ]);

    return (
        <ScreenContext.Provider value={value as IScreen}>
            {props.children}
        </ScreenContext.Provider>
    );
}
