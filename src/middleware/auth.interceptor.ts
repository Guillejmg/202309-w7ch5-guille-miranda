import createDebug from "debug";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../services/http.error.js";
import { Auth } from "../services/auth.js";
import { ManualMongoRepo } from "../repo/repo.manual/manual.mongo.repo.js";


const debug = createDebug('W7E:auth:interceptor')

export class AuthInterceptor {
  constructor(){
    debug('Instantiated');
  }

    authoritation(req: Request, res: Response, next: NextFunction ){

      try{ 
        const tokenHeader = req.get('Authoritation');
        if(!tokenHeader?.startsWith('Bearer')) 
          throw new HttpError(401, 'Unauthorized');
        const token = tokenHeader.split(' ')[1]// Aislamos el tokken de la construccion del header
        const tokenPayload = Auth.verifyAndGetPayload(token);
          req.body.userID = tokenPayload.id;// Reescribo con el tokken el del bodi por que alguien lo podria haber manipulado, por lo tantto me fio mas del que viene con el tokken
          next();
      } catch(error){
        next(error)
      }
    }

    async authenticationManual (req: Request, res: Response, next: NextFunction){
      try{ // Eres el usuario req.body.id
          const userID = req.body.userid; // Quieres actuar sobre la note req.params.id -fijate en el params de la url de la ruta - 
        const manualID = req.params.id

        const repoManual = new ManualMongoRepo(); // Me traigo la nota
        const manual = await repoManual.getById(manualID) // Ahora puedo buscarla
        if(manual.employee.id === userID) throw new HttpError(401, 'Unauthorized', 'User not valid') // Ahora te aseguras de que coincide id del usuario y el de la nota y si no tira error y si si next

        next();
      }catch(error){
        next(error)
      }
    }
}
