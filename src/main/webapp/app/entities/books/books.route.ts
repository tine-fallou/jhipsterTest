import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Books } from 'app/shared/model/books.model';
import { BooksService } from './books.service';
import { BooksComponent } from './books.component';
import { BooksDetailComponent } from './books-detail.component';
import { BooksUpdateComponent } from './books-update.component';
import { BooksDeletePopupComponent } from './books-delete-dialog.component';
import { IBooks } from 'app/shared/model/books.model';

@Injectable({ providedIn: 'root' })
export class BooksResolve implements Resolve<IBooks> {
    constructor(private service: BooksService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((books: HttpResponse<Books>) => books.body));
        }
        return of(new Books());
    }
}

export const booksRoute: Routes = [
    {
        path: 'books',
        component: BooksComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'pressingApp.books.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'books/:id/view',
        component: BooksDetailComponent,
        resolve: {
            books: BooksResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pressingApp.books.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'books/new',
        component: BooksUpdateComponent,
        resolve: {
            books: BooksResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pressingApp.books.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'books/:id/edit',
        component: BooksUpdateComponent,
        resolve: {
            books: BooksResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pressingApp.books.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const booksPopupRoute: Routes = [
    {
        path: 'books/:id/delete',
        component: BooksDeletePopupComponent,
        resolve: {
            books: BooksResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'pressingApp.books.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
