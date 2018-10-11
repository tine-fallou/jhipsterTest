import { element, by, ElementFinder } from 'protractor';

export class BookComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-book div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class BookUpdatePage {
    pageTitle = element(by.id('jhi-book-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}
