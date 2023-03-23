// Взаимосвязь с сервером
{
  const PATH = "https://jsonplaceholder.typicode.com/users";
  
  const getAjax = () => {
    let ajaxRequest;
    if (window.XMLHttpRequest) { // Chrome, Firefox, Safari
      ajaxRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {  // IE
      try {
        //Для новых версий
        ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        //Для cтарых
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
    return ajaxRequest;
  }
  
  const XML = getAjax();
  
  XML.open("GET", PATH, true);
  XML.send();
  
  // обработка данных
  XML.onreadystatechange = () => {
      try {
        if (XML.readyState === XMLHttpRequest.DONE) {
          if (XML.status === 200) {
              localStorage.setItem('ContactObject', XML.responseText);
          } else {
            throw Error(`There was a problem with the request. ${XML.status} ${XML.statusText}`);
          }
        }
      } catch (e) {
          throw Error(`Caught Exception: ${e.description}`);
      }
  };
}

{
    class Contacts {
        constructor () {
            this.data = JSON.parse(localStorage.getItem('ContactObject'));
            this.rezultBlock = document.querySelector('.result');
        }

        showContacts() {
            if (this.data) {
                this.data.map((el) => {
                    this.rezultBlock.innerHTML += `
                    <div class="contact-item" data-id="${el.id}">
                        <div class="text">
                            <p>Company name: <b>${el.company.name}</b></p>
                            <p>Name: <b>${el.name}</b></p>
                            <p>Website: <b>${el.website}</b></p>
                            <p>City: <b>${el.website}</b></p>
                            <p>Phone: <b>${el.phone}</b></p>
                            <button id="more-${el.id - 1}">To learn more</button>
                        </div>
                        <div class="btn-block">
                            <button>
                                <svg class="">
                                    <use xlink:href='./assets/icon/sprite.svg#pen'></use>
                                </svg>
                            </button>
                            <button>
                                <svg class="">
                                    <use xlink:href='./assets/icon/sprite.svg#marker'></use>
                                </svg>
                            </button>
                        </div>
                    </div>
                    `;
                });

                this.rezultBlock.addEventListener('click', (e) => {
                    const idArray = e.target.id.split('-');
                    if (idArray[0] === 'more') {
                        this.modalInfo(idArray[1]);
                    }
                })
            }
        }

        modalInfo(id) {
            const contact =  this.data[id];
            const modalDiv = document.querySelector('.modal-contact');
            modalDiv.classList.remove('hiden');
            modalDiv.innerHTML = `
            <div class="item">
                <div class="text">
                    <b>Company name:</b>
                    <p>${contact.company.name}</p>
                    <b>Name:</b>
                    <p>${contact.name}</p>
                    <b>User Name:</b>
                    <p>${contact.username}</p>
                    <b>Address:</b>
                    <p>${contact.address.city}, ${contact.address.street}, ${contact.address.suite}, ${contact.address.zipcode}</p>
                    <b>Website:</b>
                    <p>${contact.website}</p>
                    <b>Phone:</b>
                    <p>${contact.phone}</p>
                    <b>About company:</b>
                    <p>${contact.company.bs}, ${contact.company.catchPhrase}</p>
                </div>
                <div class="map">
                    <p>Карта</p>
                </div>
            </div>
            `;

            modalDiv.addEventListener('click', (e) =>  {
                const targetEl = e.target.parentNode;
                if (targetEl.classList.contains('text') || targetEl.classList.contains('item') || targetEl.classList.contains('map')) {
                    return;
                } else {
                    modalDiv.classList.add('hiden');
                }
            });
        }
    }

    const callContacts = new Contacts();

    console.log(callContacts.showContacts());
}