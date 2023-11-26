/* eslint-disable no-unused-vars */
import { Repository } from "../repo.js";
import { HttpError } from "../../services/http.error.js";
import { UserModel } from "./users.mongo.model.js";
import { LoginUser, User } from "../../entities/user.js";
import createDebug from 'debug'
import { Auth } from "../../services/auth.js";

const debug = createDebug('W7E:users:mongo:repo')
export class UserMongoRepo implements Repository<User>{
constructor(){
  debug('Instantiated');
}

  async create(newItem: Omit<User, "id">): Promise<User> {

    newItem.passwd = await Auth.hash(newItem.passwd);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async login (loginUser: LoginUser): Promise<User> {
    const results = await UserModel.findOne({email: loginUser.email}).exec(); // Estto te devuelve un array por que es un metodo filtter que no sabe si te va a devolver un solo elemento o varios, hay unas variantes de  find que solo te devuelve uno y no seria un array como findOne y lo tratarias de otra manera(en vez del lenght seria solo result!)
    if(!results ||  !(await Auth.compare(loginUser.passwd, results.passwd ))) 
    throw new HttpError(401, 'Unauthorized'); // Implementamos la encriptacion
    return results;

}
 
  async getAll(): Promise<User[]> { // Este lo hacemos por nuestra utilidad para ver los cambios que hemos implementado
    const data = await UserModel.find().exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }
  
  async search({ key, value }: { key: keyof LoginUser | 'id' | 'name' | 'surname' | 'age' | 'notes' ; value: unknown }): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  
  
  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    const result = await UserModel.findByIdAndUpdate(id, updatedItem, {new : true}).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> { // Cambiar esto
    const result = await UserModel.findByIdAndDelete(id).exec();
    
    if (!result){
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }// No retorno nada por que no quiero. un objeto vacio
  }
  
}
