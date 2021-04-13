export default (e, addHandler) => {
    if (!e.shiftKey || [38, 40].indexOf(e.keyCode) === -1) {
        return;
    }
    e.preventDefault();
    const names = e.target.name.split('.');
    const inputName = names[names.length - 1];
    let table = e.target;
    // eslint-disable-next-line no-cond-assign
    while (table = table.parentElement && table.tagName.toLowerCase() !== 'table') {} // eslint-disable-line no-empty
    const getInputs = (tableItem) => Array.prototype.slice
        .call(tableItem.querySelectorAll('input:not([type="hidden"]), select'))
        .filter(inputElement => {
            const searchInputNames = inputElement.name.split('.');
            const searchInputName = searchInputNames[searchInputNames.length - 1];
            return (
                names.length === searchInputNames.length
                    && inputName === searchInputName
            );
        });
    const inputs = getInputs(table);
    const currentIndex = inputs.findIndex(
        inputElement => inputElement.name === e.target.name,
    );
    const nextIndex = e.keyCode === 38 ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex >= 0 && nextIndex < inputs.length) {
        inputs[nextIndex].focus();
    } else if (nextIndex === inputs.length) {
        addHandler();
        setTimeout(() => {
            const inputs2 = getInputs(table);
            if (inputs2[nextIndex]) {
                inputs2[nextIndex].focus();
            }
        });
    }
};

export const isDescendant = (parent, child) => {
    let node = child.parentNode;
    while (node !== null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
};
