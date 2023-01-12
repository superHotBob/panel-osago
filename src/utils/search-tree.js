export const searchTree = (element, id) => {
    if (element.id === id) {
        return element;
    }
    if (element.children != null) {
        let i;
        let result = null;
        for (i = 0; result == null && i < element.children.length; i++) {
            result = searchTree(element.children[i], id);
        }
        return result;
    }
    return null;
}
