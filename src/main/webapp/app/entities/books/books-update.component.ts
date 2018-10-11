import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IBooks } from 'app/shared/model/books.model';
import { BooksService } from './books.service';

@Component({
    selector: 'jhi-books-update',
    templateUrl: './books-update.component.html'
})
export class BooksUpdateComponent implements OnInit {
    private _books: IBooks;
    isSaving: boolean;

    constructor(private booksService: BooksService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ books }) => {
            this.books = books;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.books.id !== undefined) {
            this.subscribeToSaveResponse(this.booksService.update(this.books));
        } else {
            this.subscribeToSaveResponse(this.booksService.create(this.books));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IBooks>>) {
        result.subscribe((res: HttpResponse<IBooks>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get books() {
        return this._books;
    }

    set books(books: IBooks) {
        this._books = books;
    }
}
