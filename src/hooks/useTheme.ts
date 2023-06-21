import React from 'react';
import useComponents from './useComponents';

export const LIGHT_THEME = 'light';
export const DARK_THEME = 'dark';

const DEFAULT_THEMES = [
    LIGHT_THEME,
    DARK_THEME,
];

const DEFAULT_THEME_STORAGE_KEY = 'theme';

export const useTheme = (themes = DEFAULT_THEMES, themeStorageKey = DEFAULT_THEME_STORAGE_KEY) => {
    const {clientStorage} = useComponents();
    const [theme, setTheme] = React.useState(clientStorage.get(themeStorageKey) || themes[0]);

    const toggleTheme = React.useCallback(() => {
        const themesExpectedCount = 2;
        if (themes.length !== themesExpectedCount) {
            throw new Error('toggleTheme callback can only be used if the number of themes is two');
        }

        const lightTheme = themes[0];
        const darkTheme = themes[1];

        setTheme(theme === lightTheme ? darkTheme : lightTheme);
    }, [themes, theme]);

    React.useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme);
        clientStorage.set(themeStorageKey, theme);
    }, [theme, clientStorage, themeStorageKey]);

    return {
        theme,
        setTheme,
        toggleTheme,
    };
};
