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
              if (localStorage.getItem('choseSortA_Z')) localStorage.removeItem('choseSortA_Z');
              if (localStorage.getItem('choseSortZ_A')) localStorage.removeItem('choseSortZ_A');
          } else {
            throw Error(`There was a problem with the request. ${XML.status} ${XML.statusText}`);
          }
        }
      } catch (e) {
          throw Error(`Caught Exception: ${e.description}`);
      }
  };
}
// вывод контактов и взаимодействия ими
{
    class Contacts {
        constructor () {
            this.data = JSON.parse(localStorage.getItem('ContactObject'));
            this.rezultBlock = document.querySelector('.result');
            this.modalDiv = document.querySelector('.for-contact');
            this.forMap = document.querySelector('.for-map');
        }

        cardContact(el) {  // структура карточки контакта
            return (
                `
                    <div class="contact-item" data-id="${el.id}">
                        <div class="text">
                            <p>Company name: <b>${el.company.name}</b></p>
                            <p>Name: <b>${el.username}</b></p>
                            <p>Website: <b>${el.website}</b></p>
                            <p>Email: <b>${el.email}</b></p>
                            <p>Phone: <b>${el.phone}</b></p>
                            <button id="more-${el.id - 1}">To learn more</button>
                        </div>
                        <div class="btn-block">
                            <button id="change-${el.id - 1}-btn">
                                <svg id="change-${el.id - 1}-svg">
                                    <use xlink:href='./assets/icon/sprite.svg#pen'></use>
                                </svg>
                            </button>
                            <button id="map-${el.id - 1}-btn">
                                <svg id="map-${el.id - 1}-svg">
                                    <use xlink:href='./assets/icon/sprite.svg#marker'></use>
                                </svg>
                            </button>
                        </div>
                    </div>
                    `
            )
        }

        showContacts() { // выводит весь список контактов
            if (this.data) {
                this.data.map((el) => {
                    this.rezultBlock.innerHTML += this.cardContact(el);
                });

                this.rezultBlock.addEventListener('click', (e) => {
                    const idArray = e.target.id.split('-');
                    if (idArray[0] === 'more') this.modalInfo(idArray[1]);
                    if (idArray[0] === 'change') this.changeContact(idArray[1]);
                    if (idArray[0] === 'map') this.showMap(this.data[idArray[1]].address.geo.lat, this.data[idArray[1]].address.geo.lng);
                });
            } else {
                this.rezultBlock.innerHTML = `<h4>Что то пошло не так, поробуйте перезагрузить, еще раз. Просим прощения за причененное не удобства.</h4>`;
              }
        }

        changeContact(id) { // при клике на иконку ручку
            const contact =  this.data[id];
            this.modalDiv.classList.remove('hiden');
            this.modalDiv.innerHTML = `
            <form class="change-form change-contact">
                <label class="change-contact" for="company-name">
                    Company name:
                    <input type="text" id="company-name" name="company-name">
                </label>
                <label class="change-contact" for="name-1">
                    Name:
                    <input type="text" id="name-1" name="name-1">
                </label>
                <label class="change-contact" for="user-name">
                    User Name:
                    <input type="text" id="user-name" name="user-name">
                </label>
                <label class="change-contact" for="city">
                    City:
                    <input type="text" id="city" name="city">
                </label>
                <label class="change-contact" for="street">
                    Street:
                    <input type="text" id="street">
                </label>
                <label class="change-contact" for="suite">
                    Suite:
                    <input type="text" id="suite" name="suite">
                </label>
                <label class="change-contact" for="zipcode">
                    Zipcode:
                    <input type="text" id="zipcode" name="zipcode">
                </label>
                <label class="change-contact" for="geo-lat">
                    Geo-lat:
                    <input type="text" id="geo-lat" name="geo-lat">
                </label>
                <label class="change-contact" for="geo-lng">
                    Geo-lng:
                    <input type="text" id="geo-lng" name="geo-lng">
                </label>
                <label class="change-contact" for="website">
                    Website:
                    <input type="text" id="website" name="website">
                </label>
                <label class="change-contact" for="email">
                    Website:
                    <input type="text" id="email" name="email">
                </label>
                <label class="change-contact" for="phone">
                    Phone:
                    <input type="text" id="phone" name="phone">
                </label>
                <label class="change-contact" for="bs">
                    Company BS:
                    <input type="text" id="bs" name="bs">
                </label>
                <label class="change-contact" for="catchPhrase">
                    Company catch phrase:
                    <input type="text" id="catchPhrase" name="catchPhrase">
                </label>
                <button id="change" type="submit">Change</button>
            </form>
            `;
            const company_name= document.querySelector('#company-name');
            const name_1= document.querySelector('#name-1');
            const user_name = document.querySelector('#user-name');
            const city = document.querySelector('#city');
            const street= document.querySelector('#street');
            const suite = document.querySelector('#suite');
            const zipcode = document.querySelector('#zipcode');
            const website = document.querySelector('#website');
            const phone = document.querySelector('#phone');
            const bs = document.querySelector('#bs');
            const catchPhrase = document.querySelector('#catchPhrase');
            const email = document.querySelector('#email');
            const geo_lat = document.querySelector('#geo-lat');
            const geo_lng = document.querySelector('#geo-lng');

            name_1.value = contact.name;
            company_name.value = contact.company.name;
            user_name.value = contact.username;
            city.value = contact.address.city;
            street.value = contact.address.street;
            suite.value = contact.address.suite;
            zipcode.value = contact.address.zipcode;
            website.value = contact.website;
            phone.value = contact.phone;
            bs.value = contact.company.bs;
            catchPhrase.value = contact.company.catchPhrase;
            email.value = contact.email;
            geo_lat.value = contact.address.geo.lat;
            geo_lng.value = contact.address.geo.lng;

            this.modalDiv.addEventListener('click', (e) =>  {
                const targetEl = e.target.parentNode;
                this.hidenModal(targetEl);
            });

            // меняет данные
            document.querySelector('#change').addEventListener('click', (e) => {
                e.preventDefault();

                const itemContact = {
                    address: {
                        city: city.value,
                        street: street.value,
                        suite: suite.value,
                        zipcode: zipcode.value,
                        geo: {
                            lat: geo_lat.value,
                            lng: geo_lng.value,
                        }
                    },
                    company: {
                        bs: bs.value,
                        catchPhrase: catchPhrase.value,
                        name: company_name.value,
                    },
                    email: email.value,
                    id: +id + 1,
                    name: name_1.value,
                    phone: phone.value,
                    username : user_name.value,
                    website: website.value,
                };

                this.data.splice(id, 1, itemContact);
                localStorage.setItem('ContactObject', JSON.stringify(this.data));
                
                this.modalDiv.classList.add('hiden');
                location.reload();
            })

        }

        modalInfo(id) { // выводит на модальное окно подробную информацию о контакте
            const contact =  this.data[id];
            this.modalDiv.classList.remove('hiden');
            this.modalDiv.innerHTML = `
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
            </div>
            `;

            this.modalDiv.addEventListener('click', (e) =>  {
                const targetEl = e.target.parentNode;
                this.hidenModal(targetEl);
            });
        }

        showMap(lat, lng) { // показывает на карте (lat, lng - это долгота и широта)
            this.forMap.classList.remove('hiden');
            this.forMap.innerHTML = `
                <div id='map'></div>
            `;

            L.mapbox.accessToken = 'pk.eyJ1IjoibGFkeTFzdCIsImEiOiJjbGV5N2V3ZjcwMjhuM3hzMnZkMjR0b3Z3In0.6214Q3EwVqdFQqy4A6PxEw';
            const map = L.mapbox.map('map')
                .setView([lng, lat], 3)
                .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
            
            L.marker([lng, lat], {
                icon: L.mapbox.marker.icon({
                    'marker-size': 'large',
                    'marker-color': '#512E5F'
                })
            }).addTo(map);

            this.forMap.addEventListener('click', (e) =>  {
                const targetEl = e.target;
                if (targetEl.id === 'map') {
                    return;
                } else {
                    this.forMap.innerHTML = '';
                    this.forMap.classList.add('hiden');
                }
            });
        }

        hidenModal(targetEl) { // скрывает модальное окно
            if (targetEl.classList.contains('change-contact') || targetEl.classList.contains('text') || targetEl.classList.contains('item') || targetEl.classList.contains('map')) {
                return;
            } else {
                this.modalDiv.classList.add('hiden');
            }
        }
    };

    class Filter extends Contacts {
        constructor(data, rezultBlock, modalDiv) {
            super(data, rezultBlock, modalDiv);
        }

        redrawFilter() {
            const filter = document.querySelector('.filter');
            filter.innerHTML += `
                <div class="sort">
                    <p class="title-sort">Sort contacts:</p>
                    <div>
                        <p>от A-Z</p> 
                        <span id="a_z">
                            <svg class="icon ${localStorage.getItem('choseSortA_Z') === 'true' ? '' : 'hiden'}">
                                <use xlink:href='./assets/icon/sprite.svg#check-mark'></use>
                            </svg>
                        </span>
                    </div>
                    <div>
                        <p>от Z-A </p>
                        <span id="z_a">
                            <svg class="icon ${localStorage.getItem('choseSortZ_A') === 'true' ? '' : 'hiden'}">
                                <use xlink:href='./assets/icon/sprite.svg#check-mark'></use>
                            </svg>
                        </span>
                    </div>
                </div>
            `;
        }

        sortContacts() { // сортировка
            const a_z = document.querySelector('#a_z');
            const z_a = document.querySelector('#z_a');
            const choseSortZ_A = document.querySelector('#z_a .icon');
            const choseSortA_Z = document.querySelector('#a_z .icon');

            const companyName = document.querySelector('#companyName');
            const name = document.querySelector('#name');
            const email_1 = document.querySelector('#email-1');
            const website_1 = document.querySelector('#website-1');

            // сортировка от A до Z
            a_z.addEventListener('click', () => {
                this.sortAlphabet(choseSortA_Z, choseSortZ_A, 'choseSortA_Z', 'choseSortZ_A');
            });

            // сортировка от Z до A
            z_a.addEventListener('click', () => {
                this.sortAlphabet(choseSortZ_A, choseSortA_Z, 'choseSortZ_A', 'choseSortA_Z');
            });

             // поиск по имени компании
            companyName.addEventListener('input', (e) => {
                const dataSearch = this.data.filter(item => {
                    if (item.company.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
                        return item;
                    }
                });
                e.target.value.length 
                    ? this.filterInput(dataSearch, companyName.nextSibling.nextSibling, companyName, name, email_1, website_1) 
                    : this.filterInput([], companyName.nextSibling.nextSibling, companyName, name, email_1, website_1);
            });

            // поиск по имени человека
            name.addEventListener('input', (e) => {
                const dataSearch = this.data.filter(item => {
                    if (item.username.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
                        return item;
                    }
                });
                e.target.value.length 
                    ? this.filterInput(dataSearch, name.nextSibling.nextSibling, companyName, name, email_1, website_1) 
                    : this.filterInput([], name.nextSibling.nextSibling, companyName, name, email_1, website_1);
            });
           
            // поиск по почту
            email_1.addEventListener('input', (e) => {
                const dataSearch = this.data.filter(item => {
                    if (item.email.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
                        return item;
                    }
                });
                e.target.value.length 
                    ? this.filterInput(dataSearch, email_1.nextSibling.nextSibling, companyName, name, email_1, website_1) 
                    : this.filterInput([], email_1.nextSibling.nextSibling, companyName, name, email_1, website_1);
            });
           
            // поиск по названию website
            website_1.addEventListener('input', (e) => {
                const dataSearch = this.data.filter(item => {
                    if (item.website.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
                        return item;
                    }
                });
                
                e.target.value.length 
                    ? this.filterInput(dataSearch, website_1.nextSibling.nextSibling, companyName, name, email_1, website_1) 
                    : this.filterInput([], website_1.nextSibling.nextSibling, companyName, name, email_1, website_1);
            });

        }

        filterInput(dataArr, ul, companyName, name, email_1, website_1) {
            let idCard;
            ul.innerHTML = '';
            if (dataArr.length > 0) {
                dataArr.map((el) => {
                    ul.innerHTML += `
                        <li id="filter-${el.id - 1}">
                            <p>${el.company.name}</p>
                            <p>${el.username}</p>
                            <p>${el.website}</p>
                            <p>${el.email}</p>
                        </li>
                    `;
                });
            }

            ul.addEventListener('click', (e) => {
                const contactID = e.target.parentNode.id.split('-');
                const contact = this.data[contactID[1]];

                companyName.value = contact.company.name;
                name.value = contact.username;
                email_1.value = contact.email;
                website_1.value = contact.website;

                idCard = contact.id - 1;

                ul.innerHTML = '';

            });

            document.querySelector('#search-btn').addEventListener('click', (e) => {
                e.preventDefault();
                this.rezultBlock.innerHTML = this.cardContact(this.data[idCard]);
                companyName.value = '';
                name.value = '';
                email_1.value = '';
                website_1.value = '';
            }, false)
        }

        sortAlphabet(nodeCh, nodeNo, localKeyCh, localKeyNo) {
            if (!nodeNo.classList.contains('hiden')) nodeNo.classList.add('hiden')
            nodeCh.classList.remove('hiden');
            localStorage.setItem(localKeyNo, 'false');
            localStorage.setItem(localKeyCh, 'true');
            
            this.data.sort((el1, el2) => {
                if (localKeyCh === 'choseSortZ_A') {
                    if (el1.company.name.toLowerCase() > el2.company.name.toLowerCase()) return -1;
                    if (el1.company.name.toLowerCase() < el2.company.name.toLowerCase()) return 1;
                } else {
                    if (el1.company.name.toLowerCase() < el2.company.name.toLowerCase()) return -1;
                    if (el1.company.name.toLowerCase() > el2.company.name.toLowerCase()) return 1;
                }
                return 0;
            });
            
            localStorage.setItem('ContactObject', JSON.stringify(this.data));
            
            location.reload();
        }
    }


    const callContacts = new Contacts();
    const filter = new Filter();

    
    filter.redrawFilter();
    filter.sortContacts();
    callContacts.showContacts();
}