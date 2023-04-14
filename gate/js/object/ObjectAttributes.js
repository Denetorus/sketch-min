import {
    DBFieldDescriptionDate, DBFieldDescriptionId,
    DBFieldDescriptionNumber,
    DBFieldDescriptionObject,
    DBFieldDescriptionString
} from "../external/db/DBObject.js";

export const ObjectAttributes = {
    animals: {
        id: new DBFieldDescriptionId({title: 'ИД'}),
        description: new DBFieldDescriptionString({title: 'Наименование'}),
        code: new DBFieldDescriptionNumber({title: 'Код'}),
        animal_type: new DBFieldDescriptionObject({title: 'Тип', refTable: "animal_types"}),
        breed: new DBFieldDescriptionObject({title: 'Порода', refTable: "breeds"}),
        color: new DBFieldDescriptionString({title: 'Цвет'}),
        created_at: new DBFieldDescriptionNumber({show: false}),
        updated_at: new DBFieldDescriptionNumber({show: false}),
    },
    animal_types: {
        id: new DBFieldDescriptionId({title: 'ИД'}),
        code: new DBFieldDescriptionNumber({title: 'Код'}),
        description: new DBFieldDescriptionString({title: 'Наименование'}),
        created_at: new DBFieldDescriptionNumber({show: false}),
        updated_at: new DBFieldDescriptionNumber({show: false}),
    }
}