import { ManualStructure } from "./manual.js"

export type LoginUser = {

  email:string, // Este puede ser el userName
  passwd:string
}

export type User = LoginUser & {
  
  id: string,
  name:string, // El nombre real
  surname:string, // String lo cambiamos por User y asi establecemos la relacion con el squema
  age:number,
  notes: ManualStructure[], // Esto lo he implementado cuando ya he decidico que los usuarios tendran notes de la coleccion notes y que sera una relacion n
}
