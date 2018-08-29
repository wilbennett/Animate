// Class that allows working with custom events of objects not attached to the DOM.
class CustomEventTarget {
    private target = document.createTextNode("");

    addEventListener = this.target.addEventListener.bind(this.target);
    removeEventListener = this.target.removeEventListener.bind(this.target);
    dispatchEvent = this.target.dispatchEvent.bind(this.target);
};
