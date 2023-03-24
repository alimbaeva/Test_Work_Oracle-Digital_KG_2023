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

const callContacts = new Contacts();

callContacts.showContacts();