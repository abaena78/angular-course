import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.module';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { VoteDownAction, VoteUpAction } from '../../models/destinos-viajes-state.model';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {
  @Input() destino: DestinoViaje;
  @Input("indice") posicion: number;
  @HostBinding('attr.class') cssClass = 'col-md-4';
  @Output() clicked: EventEmitter<DestinoViaje>;

  constructor(private store: Store<AppState>) {
    this.clicked = new EventEmitter();
  }

  ngOnInit(): void {
  }

  ir() {
    console.log('ir:');
    this.clicked.emit(this.destino)
    return false;
  }

  voteUp(){
    console.log('voteUp:');
    this.store.dispatch(new VoteUpAction(this.destino));
    return false;
  }

  voteDown(){
    console.log('voteDown:');
    this.store.dispatch(new  VoteDownAction(this.destino));
    return false;
  }

}
