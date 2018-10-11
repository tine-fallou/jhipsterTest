/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PressingTestModule } from '../../../test.module';
import { BooksDetailComponent } from 'app/entities/books/books-detail.component';
import { Books } from 'app/shared/model/books.model';

describe('Component Tests', () => {
    describe('Books Management Detail Component', () => {
        let comp: BooksDetailComponent;
        let fixture: ComponentFixture<BooksDetailComponent>;
        const route = ({ data: of({ books: new Books(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PressingTestModule],
                declarations: [BooksDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(BooksDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BooksDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.books).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
