export const buildTree = (list, parentFieldName, orderField) => {
    let tree = [],
        map = {},
        arrElem,
        mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for(let i = 0, len = list.length; i < len; i++) {
        arrElem = list[i];
        map[arrElem.id] = arrElem;
        map[arrElem.id].children = [];
    }

    for (let id in map) {
        if (map.hasOwnProperty(id)) {
            mappedElem = map[id];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem[parentFieldName]) {
                map[mappedElem[parentFieldName]]['children'].push(mappedElem);
            }
            // If the element is at the root level, add it to first level elements array.
            else {
                tree.push(mappedElem);
            }
        }
    }

    if (orderField) {
        tree.sort((el1, el2) => el1[orderField] < el2[orderField] ? -1 : (el1[orderField] > el2[orderField] ? 1 : 0))
    }

    return tree;
}
