export interface IBook {
    id?: number;
}

export class Book implements IBook {
    constructor(public id?: number) {}
}
