import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BookComponentsPage, BookUpdatePage } from './book.page-object';

describe('Book e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let bookUpdatePage: BookUpdatePage;
    let bookComponentsPage: BookComponentsPage;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Books', async () => {
        await navBarPage.goToEntity('book');
        bookComponentsPage = new BookComponentsPage();
        expect(await bookComponentsPage.getTitle()).toMatch(/pressingApp.book.home.title/);
    });

    it('should load create Book page', async () => {
        await bookComponentsPage.clickOnCreateButton();
        bookUpdatePage = new BookUpdatePage();
        expect(await bookUpdatePage.getPageTitle()).toMatch(/pressingApp.book.home.createOrEditLabel/);
        await bookUpdatePage.cancel();
    });

    it('should create and save Books', async () => {
        await bookComponentsPage.clickOnCreateButton();
        await bookUpdatePage.save();
        expect(await bookUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
