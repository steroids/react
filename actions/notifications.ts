let ID_COUNTER = 0;
export const NOTIFICATIONS_SHOW = 'NOTIFICATIONS_SHOW';
export const NOTIFICATIONS_CLOSING = 'NOTIFICATIONS_CLOSING';
export const NOTIFICATIONS_CLOSE = 'NOTIFICATIONS_CLOSE';
export const showNotification =
  ({
    message,
    level = 'warning',
    position = 'top-right',
    timeOut = 8000,
  }) => dispatch => {
  const id = ++ID_COUNTER;
  dispatch({ type: NOTIFICATIONS_SHOW, id, message, level, position});
  if(timeOut > 0){
    setTimeout(() => dispatch(closeNotification(id)), timeOut);
  }
};
export const closeNotification = (id = null) => ({
  type: NOTIFICATIONS_CLOSE,
  id
});
export const setFlashes = flashes =>
  Object.keys(flashes).map(level => {
    return []
      .concat(flashes[level] || [])
      .map(message => showNotification({message, level}));
  });
