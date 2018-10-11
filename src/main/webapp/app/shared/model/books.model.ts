export interface IBooks {
    id?: number;
    name?: string;
    author?: string;
}

export class Books implements IBooks {
    constructor(public id?: number, public name?: string, public author?: string) {}
}
