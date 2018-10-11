import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBooks } from 'app/shared/model/books.model';

type EntityResponseType = HttpResponse<IBooks>;
type EntityArrayResponseType = HttpResponse<IBooks[]>;

@Injectable({ providedIn: 'root' })
export class BooksService {
    private resourceUrl = SERVER_API_URL + 'api/books';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/books';

    constructor(private http: HttpClient) {}

    create(books: IBooks): Observable<EntityResponseType> {
        return this.http.post<IBooks>(this.resourceUrl, books, { observe: 'response' });
    }

    update(books: IBooks): Observable<EntityResponseType> {
        return this.http.put<IBooks>(this.resourceUrl, books, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IBooks>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBooks[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBooks[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
