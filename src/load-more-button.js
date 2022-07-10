export default class LoadMoreBtn {
    constructor({selector}) {
      this.refs = this.getRefs(selector);
    }
  
    getRefs(selector) {
      const refs = {};
      refs.button = document.querySelector(selector);
      refs.label = refs.button.querySelector('.load-more');
        
      return refs;
    }
  
    enable() {
      this.refs.button.disabled = false;
    }
  
    disable() {
      this.refs.button.disabled = true;
    }
  
    show() {
      this.refs.button.classList.remove('is-hidden');
    }
  
    hide() {
      this.refs.button.classList.add('is-hidden');
    }
  }