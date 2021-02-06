export class DestinoViaje {
    private selected: boolean;
    public servicios: string[];

    constructor(public nombre:string, public imagenUrl:string, public votes: number = 0){
      this.selected = false;
      this.servicios = ['baño privado', 'desayuno']
    }

    isSelected(): boolean{
      return this.selected;
    }

    setSelected(s: boolean){
      this.selected = s;
    }

    voteDown() {
      //throw new Error('Method not implemented.');
      this.votes--;
    }
    voteUp() {
      //throw new Error('Method not implemented.');
      this.votes++;
    }
}
