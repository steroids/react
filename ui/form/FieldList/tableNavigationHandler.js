
export default (e, addHandler) => {
    if (!e.shiftKey || [38, 40].indexOf(e.keyCode) === -1) {
        return;
    }

    e.preventDefault();

    const names = e.target.name.split('.');
    const inputName = names[names.length - 1];

    let table = e.target;
    while ((table = table.parentElement) && table.tagName.toLowerCase() !== 'table') {} // eslint-disable-line no-empty

    const getInputs = () => Array.prototype.slice.call(table.querySelectorAll('input:not([type="hidden"]), select'))
        .filter(inputElement => {
            const searchInputNames = inputElement.name.split('.');
            const searchInputName = searchInputNames[searchInputNames.length - 1];

            return names.length === searchInputNames.length && inputName === searchInputName;
        });

    const inputs = getInputs(table);

    const currentIndex = inputs.findIndex(inputElement => inputElement.name === e.target.name);
    const nextIndex = e.keyCode === 38 ? currentIndex - 1 : currentIndex + 1;

    if (nextIndex >= 0 && nextIndex < inputs.length) {
        inputs[nextIndex].focus();
    } else if (nextIndex === inputs.length) {
        addHandler();
        setTimeout(() => {
            const inputs = getInputs(table);
            if (inputs[nextIndex]) {
                inputs[nextIndex].focus();
            }
        });
    }
};
