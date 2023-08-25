import {DBFieldDescriptionObject, DBFieldDescriptionString} from "../external/sk-cmp/sk-cmp-db-objects.js";


export const ObjectAttributes = {
    city_types: {
        uid: new DBFieldDescriptionString({isKey: true, title: 'uid', show: false}),
        code: new DBFieldDescriptionString({title: 'code'}),
        description: new DBFieldDescriptionString({title: 'title'}),
    },
    region_types: {
        uid: new DBFieldDescriptionString({isKey: true, title: 'uid', show: false}),
        code: new DBFieldDescriptionString({title: 'code'}),
        description: new DBFieldDescriptionString({title: 'title'}),
    },
    street_types: {
        uid: new DBFieldDescriptionString({isKey: true, title: 'uid', show: false}),
        code: new DBFieldDescriptionString({title: 'code'}),
        description: new DBFieldDescriptionString({title: 'title'}),
    },
    countries: {
        uid: new DBFieldDescriptionString({isKey: true, title: 'uid', show: false}),
        code: new DBFieldDescriptionString({title: 'code'}),
        description: new DBFieldDescriptionString({title: 'title'}),
        cca2: new DBFieldDescriptionString({title: 'cca2'}),
        cca3: new DBFieldDescriptionString({title: 'cca3'}),
        ccn3: new DBFieldDescriptionString({title: 'ccn3'}),
        international_name: new DBFieldDescriptionString({title: 'international_name'}),
    },
    regions: {
        uid: new DBFieldDescriptionString({isKey: true, title: 'uid', show: false}),
        code: new DBFieldDescriptionString({title: 'code'}),
        description: new DBFieldDescriptionString({title: 'title'}),
        region_type: new DBFieldDescriptionObject({title: 'region_type', refTable: 'region_types'}),
        country: new DBFieldDescriptionObject({title: 'country', refTable: 'countries'}),
    },
}
