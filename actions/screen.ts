export const SCREEN_SET_WIDTH = 'SCREEN_SET_WIDTH';
export const SCREEN_SET_MEDIA = 'SCREEN_SET_MEDIA';

export const setMedia = media => ({
    type: SCREEN_SET_MEDIA,
    media
});

let timer = null;
export const setWidth = (width, skipTimeout = false) => dispatch => {
    if (timer) {
        clearTimeout(timer);
    }
    if (skipTimeout) {
        return dispatch({
            type: SCREEN_SET_WIDTH,
            width
        });
    } else {
        timer = setTimeout(() => {
            dispatch({
                type: SCREEN_SET_WIDTH,
                width
            });
        }, 100);
    }
    return null;
};
