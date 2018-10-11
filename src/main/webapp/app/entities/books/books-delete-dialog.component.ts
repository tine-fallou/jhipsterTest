import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBooks } from 'app/shared/model/books.model';
import { BooksService } from './books.service';

@Component({
    selector: 'jhi-books-delete-dialog',
    templateUrl: './books-delete-dialog.component.html'
})
export class BooksDeleteDialogComponent {
    books: IBooks;

    constructor(private booksService: BooksService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.booksService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'booksListModification',
                content: 'Deleted an books'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-books-delete-popup',
    template: ''
})
export class BooksDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ books }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(BooksDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.books = books;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
