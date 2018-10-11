import { element, by, ElementFinder } from 'protractor';

export class BooksComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-books div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class BooksUpdatePage {
    pageTitle = element(by.id('jhi-books-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    nameInput = element(by.id('field_name'));
    authorInput = element(by.id('field_author'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setNameInput(name) {
        await this.nameInput.sendKeys(name);
    }

    async getNameInput() {
        return this.nameInput.getAttribute('value');
    }

    async setAuthorInput(author) {
        await this.authorInput.sendKeys(author);
    }

    async getAuthorInput() {
        return this.authorInput.getAttribute('value');
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
