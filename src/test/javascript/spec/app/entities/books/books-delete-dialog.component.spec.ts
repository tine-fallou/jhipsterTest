/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PressingTestModule } from '../../../test.module';
import { BooksDeleteDialogComponent } from 'app/entities/books/books-delete-dialog.component';
import { BooksService } from 'app/entities/books/books.service';

describe('Component Tests', () => {
    describe('Books Management Delete Component', () => {
        let comp: BooksDeleteDialogComponent;
        let fixture: ComponentFixture<BooksDeleteDialogComponent>;
        let service: BooksService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PressingTestModule],
                declarations: [BooksDeleteDialogComponent]
            })
                .overrideTemplate(BooksDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BooksDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BooksService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
