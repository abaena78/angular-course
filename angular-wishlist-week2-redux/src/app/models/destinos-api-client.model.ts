import { BehaviorSubject, Subject } from "rxjs";
import { DestinoViaje } from "./destino-viaje.model";


export class DestinosApiClient {
  destinos: DestinoViaje[];
  current: Subject<DestinoViaje> = new BehaviorSubject<DestinoViaje>(null); //null=default

  constructor(){
    this.destinos = []
  }

  add(d:DestinoViaje){
    this.destinos.push(d);
  }
  getAll():DestinoViaje[] {
    return this.destinos;
  }
  getById(id:string):DestinoViaje {
    return this.destinos.filter(function(d){return d.nombre.toString() == id;})[0];
  }

  elegir(d: DestinoViaje){
    this.destinos.forEach(
      x => x.setSelected(false)  //funcion lambda
    );
    d.setSelected(true);
    this.current.next(d); //setea el valor al observable
  }
  subscribeOnChange(fn){ //funcion para que poderse suscribir a las actualizaciones del observable
    this.current.subscribe(fn);
  }
}
