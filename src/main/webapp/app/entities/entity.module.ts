import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PressingBookModule } from './book/book.module';
import { PressingBooksModule } from './books/books.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        PressingBookModule,
        PressingBooksModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PressingEntityModule {}
