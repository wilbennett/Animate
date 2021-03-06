﻿interface Array<T> {
    remove(item: T): Array<T>;
}

Array.prototype.remove = function (item) {
    let index = this.indexOf(item);

    if (index >= 0)
        this.splice(index, 1);

    return this;
}
