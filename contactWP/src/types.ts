export interface IContacts { 
    address: {
        city: string; 
        street: string; 
        suite: string; 
        zipcode: string; 
        geo: {
            lat: number;
            lng: number;
        }
    },
    company: {
        bs: string; 
        catchPhrase: string; 
        name: string; 
    },
    email: string; 
    id: number;
    name: string; 
    phone: string; 
    username : string; 
    website: string; 
}

export interface IGeojson {
    type: string;
    features: [
      {
        type: string;
        geometry: {
          type: string;
          coordinates: string[],
        },
        properties: {
          title: string;
          description: string;
        }
      },
    ]
}