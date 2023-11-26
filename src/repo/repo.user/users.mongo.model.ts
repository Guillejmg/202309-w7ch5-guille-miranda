import { User } from "../../entities/user.js";
import { Schema, model } from "mongoose";

const usersSchema = new Schema<User>({
  email:{
    type: String,
    required: true,
    unique:  true
  },
  passwd:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: false,
  },
  surname: String, // Si solo pones propiedad y tipo es un ataja para cuando solo quieres definir el tipo
  age: Number,
  notes:[
    {
        type: Schema.Types.ObjectId,
        ref: 'ManualStructure',
    }
  ]
})

usersSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const UserModel = model('User', usersSchema, 'users');
