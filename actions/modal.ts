export const MODAL_OPEN = '@modal/open';
export const MODAL_MARK_CLOSING = '@modal/markClosing';
export const MODAL_CLOSE = '@modal/close';

let idCounter = 0;
export const openModal = (modal, props: any = {}) => {
    let id = props ? props.modalId : null;
    if (!id) {
        modal._modalId = modal._modalId || 'modal-' + ++idCounter;
        id = modal._modalId;
    }

    return {
        type: MODAL_OPEN,
        id,
        modal,
        group: props.modalGroup || null,
        props,
    };
};

export const modalMarkClosing = (id, group = null) => ({
    type: MODAL_MARK_CLOSING,
    id,
    group,
});


export const closeModal = (id, group = null) => ({
    type: MODAL_CLOSE,
    id,
    group,
});
