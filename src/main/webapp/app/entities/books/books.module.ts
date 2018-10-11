import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PressingSharedModule } from 'app/shared';
import {
    BooksComponent,
    BooksDetailComponent,
    BooksUpdateComponent,
    BooksDeletePopupComponent,
    BooksDeleteDialogComponent,
    booksRoute,
    booksPopupRoute
} from './';

const ENTITY_STATES = [...booksRoute, ...booksPopupRoute];

@NgModule({
    imports: [PressingSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [BooksComponent, BooksDetailComponent, BooksUpdateComponent, BooksDeleteDialogComponent, BooksDeletePopupComponent],
    entryComponents: [BooksComponent, BooksUpdateComponent, BooksDeleteDialogComponent, BooksDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PressingBooksModule {}
