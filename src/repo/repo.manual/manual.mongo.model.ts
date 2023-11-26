import { Schema, model } from "mongoose";
import { ManualStructure } from "../../entities/manual.js";

const manualSchema = new Schema<ManualStructure>({
  
  name:{ 
    type: String,// Si este fuera el user lo relaconariamos con la coleccion users cambiando string por por el tipo schema.types.objetId y cambiaria la propiedad required por la propiedad ref:'User',
    required: true,
    unique:  true,
  },
  ingredients:{
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  onMenu:{
    type: Boolean,
    required: true,
    default: false,
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
})

manualSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const manualModel = model('Manual', manualSchema, 'manuals') // Este seria para crear. un subjet
