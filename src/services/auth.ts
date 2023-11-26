import { hash,compare } from "bcrypt";
// Import { JwtPayload, sign } from "jsonwebtoken"; esto no funcion apor un tema de importacion, que no la soporta por nombres por un tema de compatibilidades, entonces cuando algo no lo puedes importar por nombre lo importamos default y delante de los nombres de antes le tendras que poner el nombre que le hayas puesto seguido de un punto
import jwt from "jsonwebtoken";
import 'dotenv/config';
import { User } from "../entities/user.js";
import { HttpError } from "../services/http.error.js";
import createDebug from 'debug'

const debug = createDebug('W7E:auth');

debug('Imported');
type TokenPayload = {
  id:User['id']
  email: string
} & jwt.JwtPayload; // Esto signofoca que es un extension de este tipo nativo de JWT
export abstract class Auth {
  static secret = process.env.JWT_SECRET;
  static hash(value:string): Promise<string>{
    const saltRound = 10
    return hash(value, saltRound);
  }

  static compare (value:string, hash: string): Promise<boolean>{// Este tipado me fallaba si no tenia return pregutalo
    return compare(value,hash);
  }

  static signJWT(payload: TokenPayload){ // Esta funcion devuelve un string que sera el tokken
    return jwt.sign(payload, Auth.secret!)// Exclamacion para que no pueda vale null
  }

  static verifyAndGetPayload (tokken: string){
    try{ // Esto es por que si no lo homogeneizo me saldra un error que da a confucion asi qeu quiero controlarlo
    const result = jwt.verify(tokken, Auth.secret!);
    if (typeof result ===  'string') throw new HttpError(498, 'Invalid token', result)
    return result as TokenPayload;
    }catch(error){
      throw new HttpError(498, 'Invalid token', (error as Error).message)
    }
  }
}
// Aqui le puede poner temp un debug(Auth.secret) para ver si lo esta procesando
