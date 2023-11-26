import { ManualStructure } from "../../entities/manual.js";
import { Repository } from "../repo.js";
import { HttpError } from "../../services/http.error.js";
import { manualModel } from "./manual.mongo.model.js";
import { UserMongoRepo } from "../repo.user/users.mongo.repo.js";
import createDebug from "debug";
import mongoose from "mongoose";


const debug = createDebug('W7E:manual:mongo:repo');
export class ManualMongoRepo implements Repository<ManualStructure>{
userRepo: UserMongoRepo;
constructor(){
  this.userRepo = new UserMongoRepo();
    debug('Instantiated');
}

  async getAll(): Promise<ManualStructure[]> {
    const result = await manualModel.find()
      .populate('employee', {
        notes: 0,
      })
      .exec();
    return result;
  }

  async getById(id: string): Promise<ManualStructure> {
    const result = await manualModel.findById(id)
      .populate('employee', {
        notes: 0,
      })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result; // Como puede ser null en vez de id hay que ponerle el httperror e igual para los siguientes
  }

  async search({
    key,
    value,
  }: {
    key: keyof ManualStructure;
    value: any;
  }): Promise<ManualStructure[]> {
    const result = await manualModel.find({ [key]: value })
      .populate('employee', {
        notes: 0,
      })
      .exec();

    return result;
  }

  async create(newItem: Omit<ManualStructure, 'id'>): Promise<ManualStructure> {// Aqui si hubiese algun error se dispararia ya en el controller

    const userID = newItem.employee.id; // Obtenfgo el id del usuario
    const user = await this.userRepo.getById(userID);  // Compruebo si el usuario existe, si no existe el error se tira del getbyid
    const result: ManualStructure = await manualModel.create({...newItem, employee: userID});// Aqui creo la nota, la ultima linea es que mongoose solo quiere el id.del autor para hacer la nota
    user.notes.push(result); // Actualizo el array de notas del usuario 
    await this.userRepo.update(userID, user); // Guarda esta actualizacion
    return result;// Esto ya no va aqui
  }
  
  async update(id: string, updatedItem: Partial<ManualStructure>): Promise<ManualStructure> {
    const result = await manualModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('employee', {
        notes: 0,
      })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await manualModel.findByIdAndDelete(id)
    .populate('employee', {
      notes:0,
    })
    .exec();
    
    if (!result){
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    } // No retorno nada por que no quiero. un objeto vacio

    const userID = result.employee.id;
    const user = await this.userRepo.getById(userID);
    const manual = new mongoose.mongo.ObjectId(id) as unknown as ManualStructure;
    user.notes = user.notes.filter((item) => item !== manual);
    await this.userRepo.update(userID, user);

  }
  
}
