class CandidateComponent extends HTMLElement {
  constructor() {
    super();
    this.selection = null;
    this.upVotes = parseInt(this.dataset.up, 10);
    this.downVotes = parseInt(this.dataset.down, 10);
    this.totalVotes = this.upVotes + this.downVotes;
    this.init();
    this.updateVotes();
  }

  init() {
    if (this.children.length > 0) {
      [...this.children].forEach((element) => {
        if ([...element.classList].includes('item__content-foot')) {
          [...element.children].forEach((cElement) => {
            if ([...cElement.classList].includes('content-foot__btn')) {
              cElement.addEventListener('click', (event) => {
                const btn = event;
                if (this.selection === null) {
                  throw new Error('please choose an option');
                }
                if (this.selection) {
                  this.upVotes += 1;
                } else {
                  this.downVotes += 1;
                }
                this.totalVotes = this.upVotes + this.downVotes;
                btn.target.innerHTML = 'Thank you for voting!';
                const body = JSON.stringify({ votes: { up: this.upVotes, down: this.downVotes } });
                const headers = { 'Content-Type': 'application/json' };
                this.request({
                  url: `http://localhost:3000/candidates/${this.id}`, method: 'PATCH', body, headers
                })
                  .then(() => {
                    this.resetSelections();
                    this.selection = null;
                    btn.target.innerHTML = 'Vote again';
                    this.updateVotes();
                  });

                return true;
              });
            } else if ([...cElement.classList].includes('item__content-icon')) {
              cElement.addEventListener('click', () => {
                this.resetSelections();
                if ([...cElement.classList].includes('up')) {
                  this.selection = true;
                } else {
                  this.selection = false;
                }
                if ([...cElement.classList].includes('selected')) {
                  cElement.classList.remove('selected');
                } else {
                  cElement.classList.add('selected');
                }
                return true;
              });
            }
          });
        }
      });
    } else {
      throw new Error('you must have childrens to make this module work !');
    }
  }

  updateVotes() {
    [...this.children].forEach((element) => {
      const container = element;
      if ([...container.classList].includes('candidates-item__votes')) {
        [...container.children].forEach((vElement, index) => {
          const percentContainer = vElement;
          let votes = 0;
          if (index === 0) {
            votes = this.upVotes;
          } else {
            votes = this.downVotes;
          }
          const percentaje = `${Math.round((votes / this.totalVotes) * 100)}%`;
          percentContainer.style.flex = percentaje;
          percentContainer.children[1].innerHTML = percentaje;
        });
      } else if ([...container.classList].includes('item__content-head')) {
        if (this.downVotes > this.upVotes) {
          container.children[0].classList.remove('up');
          container.children[0].classList.add('down');
          container.children[0].children[0].children[0].src = '/img/down.png';
        } else {
          container.children[0].classList.remove('down');
          container.children[0].classList.add('up');
          container.children[0].children[0].children[0].src = '/img/up.png';
        }
      }
    });
  }

  static request(obj) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(obj.method || 'GET', obj.url);
      if (obj.headers) {
        Object.keys(obj.headers).forEach((key) => {
          xhr.setRequestHeader(key, obj.headers[key]);
        });
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(obj.body);
    });
  }

  static resetSelections() {
    if (document.getElementsByClassName('selected').length > 0) {
      [...document.getElementsByClassName('selected')].forEach((selectd) => {
        selectd.classList.remove('selected');
      });
    }
  }

  static connectedCallback() {}
}

customElements.define('candidates-item', CandidateComponent);
