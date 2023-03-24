import './index.css';
import { IContacts } from './types';

const PATH = 'https://jsonplaceholder.typicode.com/users';

const getAjax = () => {
  let ajaxRequest;
  if (global.XMLHttpRequest) {
    ajaxRequest = new XMLHttpRequest();
  } else if ((window as any).ActiveXObject) {
    try {
      ajaxRequest = new (window as any).ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      ajaxRequest = new (window as any).ActiveXObject('Microsoft.XMLHTTP');
    }
  }
  return ajaxRequest;
};

const XML = getAjax();

XML.open('GET', PATH, true);
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
  } catch (e: any) {
    throw Error(`Caught Exception: ${e.description}`);
  }
};

class Contacts {
    data : IContacts[];
    rezultBlock: HTMLElement | null;
    modalDiv: HTMLDivElement | null;
    forMap: HTMLDivElement | null;
constructor () {
    this.data = JSON.parse(localStorage.getItem('ContactObject') as string);
    this.rezultBlock = document.querySelector('.result');
    this.modalDiv = document.querySelector('.for-contact');
    this.forMap = document.querySelector('.for-map');
}
cardContact(el: IContacts) {  // структура карточки контакта
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
                        <svg id="change-${el.id - 1}-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 485.219 485.22" >
                            <path d="M467.476,146.438l-21.445,21.455L317.35,39.23l21.445-21.457c23.689-23.692,62.104-23.692,85.795,0l42.886,42.897
                                C491.133,84.349,491.133,122.748,467.476,146.438z M167.233,403.748c-5.922,5.922-5.922,15.513,0,21.436
                                c5.925,5.955,15.521,5.955,21.443,0L424.59,189.335l-21.469-21.457L167.233,403.748z M60,296.54c-5.925,5.927-5.925,15.514,0,21.44
                                c5.922,5.923,15.518,5.923,21.443,0L317.35,82.113L295.914,60.67L60,296.54z M338.767,103.54L102.881,339.421
                                c-11.845,11.822-11.815,31.041,0,42.886c11.85,11.846,31.038,11.901,42.914-0.032l235.886-235.837L338.767,103.54z
                                M145.734,446.572c-7.253-7.262-10.749-16.465-12.05-25.948c-3.083,0.476-6.188,0.919-9.36,0.919
                                c-16.202,0-31.419-6.333-42.881-17.795c-11.462-11.491-17.77-26.687-17.77-42.887c0-2.954,0.443-5.833,0.859-8.703
                                c-9.803-1.335-18.864-5.629-25.972-12.737c-0.682-0.677-0.917-1.596-1.538-2.338L0,485.216l147.748-36.986
                                C147.097,447.637,146.36,447.193,145.734,446.572z"/>

                        </svg>
                    </button>
                    <button id="map-${el.id - 1}-btn">
                        <svg id="map-${el.id - 1}-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.412 46.412">
                        <path d="M39.652,16.446C39.652,7.363,32.289,0,23.206,0C14.124,0,6.761,7.363,6.761,16.446c0,1.775,0.285,3.484,0.806,5.086h0
                            c0,0,1.384,6.212,15.536,24.742c8.103-10.611,12.018-17.178,13.885-20.857C38.67,22.836,39.652,19.756,39.652,16.446z
                            M23.024,27.044c-5.752,0-10.416-4.663-10.416-10.416c0-5.752,4.664-10.415,10.416-10.415s10.416,4.663,10.416,10.415
                            C33.439,22.381,28.776,27.044,23.024,27.044z"/>
                        <path d="M23.206,46.412c-0.036-0.047-0.07-0.092-0.105-0.139c-0.036,0.047-0.07,0.091-0.106,0.139H23.206z"/>
                        </svg>
                    </button>
                </div>
            </div>
            `
    )
}
showContacts() { // выводит весь список контактов
    if (this.data) {
        this.data.map((el: IContacts) => {
            if (this.rezultBlock) {
                this.rezultBlock.innerHTML += this.cardContact(el);
            }
        });
        if (!this.rezultBlock) return;
        this.rezultBlock.addEventListener('click', (e) => {
            const idArray = (e.target as HTMLDivElement).id.split('-') as any[];
            if (idArray[0] === 'more') this.modalInfo(idArray[1]);
            if (idArray[0] === 'change') this.changeContact(idArray[1]);
            // if (idArray[0] === 'map') this.showMap(this.data[idArray[1]].address.geo.lat, this.data[idArray[1]].address.geo.lng);
        });
    }
}
changeContact(id: number) { // при клике на иконку ручку
    const contact =  this.data[id];
    if (this.modalDiv) {
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
    }
    const company_name= document.querySelector('#company-name') as HTMLInputElement;
    const name_1= document.querySelector('#name-1') as HTMLInputElement;
    const user_name = document.querySelector('#user-name') as HTMLInputElement;
    const city = document.querySelector('#city') as HTMLInputElement;
    const street= document.querySelector('#street') as HTMLInputElement;
    const suite = document.querySelector('#suite') as HTMLInputElement;
    const zipcode = document.querySelector('#zipcode') as HTMLInputElement;
    const website = document.querySelector('#website') as HTMLInputElement;
    const phone = document.querySelector('#phone') as HTMLInputElement;
    const bs = document.querySelector('#bs') as HTMLInputElement;
    const catchPhrase = document.querySelector('#catchPhrase') as HTMLInputElement;
    const email = document.querySelector('#email') as HTMLInputElement;
    const geo_lat = document.querySelector('#geo-lat') as HTMLInputElement;
    const geo_lng = document.querySelector('#geo-lng') as HTMLInputElement;
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
    geo_lat.value = String(contact.address.geo.lat);
    geo_lng.value = String(contact.address.geo.lng);
    if (this.modalDiv) {
        this.modalDiv.addEventListener('click', (e) =>  {
            const targetEl = (e.target as HTMLElement).parentNode as HTMLDivElement;
            this.hidenModal(targetEl);
        });
    }
    // меняет данные
    (document.querySelector('#change') as HTMLButtonElement).addEventListener('click', (e) => {
        e.preventDefault();
        const itemContact: IContacts = {
            address: {
                city: city.value,
                street: street.value,
                suite: suite.value,
                zipcode: zipcode.value,
                geo: {
                    lat: Number(geo_lat.value),
                    lng: Number(geo_lng.value),
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
        
        if (!this.modalDiv) return;
        this.modalDiv.classList.add('hiden');
        location.reload();
    })
}
modalInfo(id: number) { // выводит на модальное окно подробную информацию о контакте
    const contact =  this.data[id];
    if (this.modalDiv) {
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
            const targetEl = (e.target as HTMLElement).parentNode as HTMLDivElement;
            if (targetEl) this.hidenModal(targetEl);
        });
    }
}
//   showMap(lat: number, lng: number) { // показывает на карте (lat, lng - это долгота и широта)
//     if (this.forMap) {
//         this.forMap.classList.remove('hiden');
//         this.forMap.innerHTML = `
//             <div id='map'></div>
//         `;
//     }
//     L.mapbox.accessToken = 'pk.eyJ1IjoibGFkeTFzdCIsImEiOiJjbGV5N2V3ZjcwMjhuM3hzMnZkMjR0b3Z3In0.6214Q3EwVqdFQqy4A6PxEw';
//     const map = L.mapbox.map('map')
//         .setView([lng, lat], 3)
//         .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    
//     L.marker([lng, lat], {
//         icon: L.mapbox.marker.icon({
//             'marker-size': 'large',
//             'marker-color': '#512E5F'
//         })
//     }).addTo(map);

//     if (this.forMap) {
//         this.forMap.addEventListener('click', (e) =>  {
//             const targetEl = e.target as HTMLDivElement;
//             if (targetEl.id === 'map') {
//                 return;
//             } else {
//                 this.forMap!.innerHTML = '';
//                 this.forMap!.classList.add('hiden');
//             }
//         });
//     }
//   }
  hidenModal(targetEl: HTMLElement | null) { // скрывает модальное окно
    if (targetEl) {
        if (targetEl.classList.contains('change-contact') || targetEl.classList.contains('text') || targetEl.classList.contains('item') || targetEl.classList.contains('map')) {
            return;
            } else {
                this.modalDiv!.classList.add('hiden');
            }
        }
    }
};

class Filter extends Contacts {
    data : IContacts[];
    rezultBlock: HTMLElement | null;
    modalDiv: HTMLDivElement | null;
    constructor() {
        super();
        this.data = JSON.parse(localStorage.getItem('ContactObject') as string);
        this.rezultBlock = document.querySelector('.result');
        this.modalDiv = document.querySelector('.for-contact');
    }

    redrawFilter() {
        const filter = document.querySelector('.filter') as HTMLElement;
        filter.innerHTML = `
            <form>
                <p class="title-form">Search</p>
                <div>
                    <label for="companyName">
                        Company Name:
                        <input type="text" id="companyName" name="companyName" placeholder="Company Name">
                        <ul class="company-name">
                        </ul>
                    </label>
                    <label for="name">
                        User Name:
                        <input type="text" id="name" name="name" placeholder="User Name">
                        <ul class="name"></ul>
                    </label>
                    <label for="email-1">
                        Email:
                        <input type="text" id="email-1" name="email-1" placeholder="Email">
                        <ul class="email"></ul>
                    </label>
                    <label for="website-1">
                        Website:
                        <input type="text" id="website-1" name="website-1" placeholder="Website">
                        <ul class="website"></ul>
                    </label>
                </div>
                <button id="search-btn" type="submit">search</button>
            </form>
            <div class="sort">
                <p class="title-sort">Sort contacts:</p>
                <div>
                    <p>от A-Z</p> 
                    <span id="a_z">
                        <svg class="icon ${localStorage.getItem('choseSortA_Z') === 'true' ? '' : 'hiden'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 611.99 611.99">
                        <path d="M589.105,80.63c-30.513-31.125-79.965-31.125-110.478,0L202.422,362.344l-69.061-70.438
                            c-30.513-31.125-79.965-31.125-110.478,0c-30.513,31.125-30.513,81.572,0,112.678l124.29,126.776
                            c30.513,31.125,79.965,31.125,110.478,0l331.453-338.033C619.619,162.202,619.619,111.755,589.105,80.63z M561.5,165.148
                            c0,0-326.308,332.811-331.453,338.053c-15.247,15.553-39.982,15.553-55.249,0c0,0-125.074-127.581-125.457-128.002
                            c-14.099-15.629-13.697-39.963,1.147-55.114c15.247-15.553,39.983-15.553,55.249,0l96.666,98.598l303.848-309.874
                            c15.247-15.553,39.982-15.553,55.249,0C576.748,124.362,576.748,149.595,561.5,165.148z"/>
                        </svg>
                    </span>
                </div>
                <div>
                    <p>от Z-A </p>
                    <span id="z_a">
                        <svg class="icon ${localStorage.getItem('choseSortZ_A') === 'true' ? '' : 'hiden'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 611.99 611.99">
                        <path d="M589.105,80.63c-30.513-31.125-79.965-31.125-110.478,0L202.422,362.344l-69.061-70.438
                            c-30.513-31.125-79.965-31.125-110.478,0c-30.513,31.125-30.513,81.572,0,112.678l124.29,126.776
                            c30.513,31.125,79.965,31.125,110.478,0l331.453-338.033C619.619,162.202,619.619,111.755,589.105,80.63z M561.5,165.148
                            c0,0-326.308,332.811-331.453,338.053c-15.247,15.553-39.982,15.553-55.249,0c0,0-125.074-127.581-125.457-128.002
                            c-14.099-15.629-13.697-39.963,1.147-55.114c15.247-15.553,39.983-15.553,55.249,0l96.666,98.598l303.848-309.874
                            c15.247-15.553,39.982-15.553,55.249,0C576.748,124.362,576.748,149.595,561.5,165.148z"/>
                        </svg>
                    </span>
                </div>
            </div>
        `;
    }

    sortContacts() { // сортировка
        const a_z = document.querySelector('#a_z') as HTMLSpanElement;
        const z_a = document.querySelector('#z_a') as HTMLSpanElement;
        const choseSortZ_A = document.querySelector('#z_a .icon');
        const choseSortA_Z = document.querySelector('#a_z .icon');

        const companyName = document.querySelector('#companyName') as HTMLInputElement;
        const name = document.querySelector('#name') as HTMLInputElement;
        const email_1 = document.querySelector('#email-1') as HTMLInputElement;
        const website_1 = document.querySelector('#website-1') as HTMLInputElement;

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
                if (item.company.name.toLowerCase().indexOf((e.target as HTMLInputElement).value.toLowerCase()) !== -1) {
                    return item;
                }
            });
            const ul = (companyName.nextSibling as HTMLTextAreaElement).nextSibling as HTMLUListElement;
            (e.target as HTMLInputElement).value.length 
                ? this.filterInput(dataSearch, ul, companyName, name, email_1, website_1) 
                : this.filterInput([], ul, companyName, name, email_1, website_1);
        });

        // поиск по имени человека
        name.addEventListener('input', (e) => {
            const dataSearch = this.data.filter(item => {
                if (item.username.toLowerCase().indexOf((e.target as HTMLInputElement).value.toLowerCase()) !== -1) {
                    return item;
                }
            });
            const ul = (companyName.nextSibling as HTMLTextAreaElement).nextSibling as HTMLUListElement;
            (e.target as HTMLInputElement).value.length 
                ? this.filterInput(dataSearch, ul, companyName, name, email_1, website_1) 
                : this.filterInput([], ul, companyName, name, email_1, website_1);
        });
       
        // поиск по почту
        email_1.addEventListener('input', (e) => {
            const dataSearch = this.data.filter(item => {
                if (item.email.toLowerCase().indexOf((e.target as HTMLInputElement).value.toLowerCase()) !== -1) {
                    return item;
                }
            });
            const ul = (companyName.nextSibling as HTMLTextAreaElement).nextSibling as HTMLUListElement;
            (e.target as HTMLInputElement).value.length 
                ? this.filterInput(dataSearch, ul, companyName, name, email_1, website_1) 
                : this.filterInput([], ul, companyName, name, email_1, website_1);
        });
       
        // поиск по названию website
        website_1.addEventListener('input', (e) => {
            const dataSearch = this.data.filter(item => {
                if (item.website.toLowerCase().indexOf((e.target as HTMLInputElement).value.toLowerCase()) !== -1) {
                    return item;
                }
            });
            const ul = (companyName.nextSibling as HTMLTextAreaElement).nextSibling as HTMLUListElement;
            (e.target as HTMLInputElement).value.length 
                ? this.filterInput(dataSearch, ul, companyName, name, email_1, website_1) 
                : this.filterInput([], ul, companyName, name, email_1, website_1);
        });

    }

    filterInput(
        dataArr: IContacts[], 
        ul: HTMLUListElement, 
        companyName: HTMLInputElement, 
        name: HTMLInputElement, 
        email_1: HTMLInputElement, 
        website_1: HTMLInputElement
        ) {
        let idCard: number;
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
            const target_El = e.target as HTMLElement;
            if (!target_El) return;
            const contactID = ( <HTMLElement>target_El.parentNode).id.split('-') as [string, number];
            const contact = this.data[contactID[1]];

            companyName.value = contact.company.name;
            name.value = contact.username;
            email_1.value = contact.email;
            website_1.value = contact.website;

            idCard = contact.id - 1;

            ul.innerHTML = '';

        });

        (<HTMLButtonElement>document.querySelector('#search-btn')).addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.rezultBlock) return;
            this.rezultBlock.innerHTML = this.cardContact(this.data[idCard]);
            companyName.value = '';
            name.value = '';
            email_1.value = '';
            website_1.value = '';
        }, false)
    }

    sortAlphabet(
        nodeCh: Element | null, 
        nodeNo: Element | null, 
        localKeyCh: string, 
        localKeyNo: string
        ) {
        if (!nodeNo) return;
        if (!nodeNo.classList.contains('hiden')) nodeNo.classList.add('hiden')
        nodeCh!.classList.remove('hiden');
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