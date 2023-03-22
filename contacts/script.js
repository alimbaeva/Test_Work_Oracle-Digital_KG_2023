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
    // const contactData = localStorage.getItem('ContactObject');

    class Contacts {
        constructor () {
            this.data = JSON.parse(localStorage.getItem('ContactObject'));
            this.rezultBlock = document.querySelector('.result');
        }

        showContacts() {
            if (this.data) {
                this.data.map((el) => {
                    console.log(el);
                    this.rezultBlock.innerHTML += `
                    <div class="contact-item" data-id="${el.id - 1}">
                        <div class="text">
                            <p>Company name: <b>${el.company.name}</b></p>
                            <p>Name: <b>${el.name}</b></p>
                            <p>Website: <b>${el.website}</b></p>
                            <p>City: <b>${el.website}</b></p>
                            <p>Phone: <b>${el.phone}</b></p>
                            <button>To learn more</button>
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
                    `
                })
            }
        }
    }

    const callContacts = new Contacts();

    console.log(callContacts.showContacts());
}