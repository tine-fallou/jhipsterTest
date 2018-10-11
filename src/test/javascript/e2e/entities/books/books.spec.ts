import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BooksComponentsPage, BooksUpdatePage } from './books.page-object';

describe('Books e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let booksUpdatePage: BooksUpdatePage;
    let booksComponentsPage: BooksComponentsPage;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Books', async () => {
        await navBarPage.goToEntity('books');
        booksComponentsPage = new BooksComponentsPage();
        expect(await booksComponentsPage.getTitle()).toMatch(/pressingApp.books.home.title/);
    });

    it('should load create Books page', async () => {
        await booksComponentsPage.clickOnCreateButton();
        booksUpdatePage = new BooksUpdatePage();
        expect(await booksUpdatePage.getPageTitle()).toMatch(/pressingApp.books.home.createOrEditLabel/);
        await booksUpdatePage.cancel();
    });

    it('should create and save Books', async () => {
        await booksComponentsPage.clickOnCreateButton();
        await booksUpdatePage.setNameInput('name');
        expect(await booksUpdatePage.getNameInput()).toMatch('name');
        await booksUpdatePage.setAuthorInput('author');
        expect(await booksUpdatePage.getAuthorInput()).toMatch('author');
        await booksUpdatePage.save();
        expect(await booksUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
