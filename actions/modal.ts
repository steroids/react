export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
let idCounter = 0;
export const openModal = (modal, props) => {
  let id = props ? props.modalId : null;
  if (!id) {
    modal._modalId = modal._modalId || 'modal-' + ++idCounter;
    id = modal._modalId;
  }
  return {
    type: OPEN_MODAL,
    id,
    modal,
    props
  };
};
export const closeModal = id => ({ type: CLOSE_MODAL, id });
