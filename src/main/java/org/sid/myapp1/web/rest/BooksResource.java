package org.sid.myapp1.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.sid.myapp1.domain.Books;
import org.sid.myapp1.service.BooksService;
import org.sid.myapp1.web.rest.errors.BadRequestAlertException;
import org.sid.myapp1.web.rest.util.HeaderUtil;
import org.sid.myapp1.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Books.
 */
@RestController
@RequestMapping("/api")
public class BooksResource {

    private final Logger log = LoggerFactory.getLogger(BooksResource.class);

    private static final String ENTITY_NAME = "books";

    private final BooksService booksService;

    public BooksResource(BooksService booksService) {
        this.booksService = booksService;
    }

    /**
     * POST  /books : Create a new books.
     *
     * @param books the books to create
     * @return the ResponseEntity with status 201 (Created) and with body the new books, or with status 400 (Bad Request) if the books has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/books")
    @Timed
    public ResponseEntity<Books> createBooks(@Valid @RequestBody Books books) throws URISyntaxException {
        log.debug("REST request to save Books : {}", books);
        if (books.getId() != null) {
            throw new BadRequestAlertException("A new books cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Books result = booksService.save(books);
        return ResponseEntity.created(new URI("/api/books/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /books : Updates an existing books.
     *
     * @param books the books to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated books,
     * or with status 400 (Bad Request) if the books is not valid,
     * or with status 500 (Internal Server Error) if the books couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/books")
    @Timed
    public ResponseEntity<Books> updateBooks(@Valid @RequestBody Books books) throws URISyntaxException {
        log.debug("REST request to update Books : {}", books);
        if (books.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Books result = booksService.save(books);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, books.getId().toString()))
            .body(result);
    }

    /**
     * GET  /books : get all the books.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of books in body
     */
    @GetMapping("/books")
    @Timed
    public ResponseEntity<List<Books>> getAllBooks(Pageable pageable) {
        log.debug("REST request to get a page of Books");
        Page<Books> page = booksService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/books");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /books/:id : get the "id" books.
     *
     * @param id the id of the books to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the books, or with status 404 (Not Found)
     */
    @GetMapping("/books/{id}")
    @Timed
    public ResponseEntity<Books> getBooks(@PathVariable Long id) {
        log.debug("REST request to get Books : {}", id);
        Optional<Books> books = booksService.findOne(id);
        return ResponseUtil.wrapOrNotFound(books);
    }

    /**
     * DELETE  /books/:id : delete the "id" books.
     *
     * @param id the id of the books to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/books/{id}")
    @Timed
    public ResponseEntity<Void> deleteBooks(@PathVariable Long id) {
        log.debug("REST request to delete Books : {}", id);
        booksService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/books?query=:query : search for the books corresponding
     * to the query.
     *
     * @param query the query of the books search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/books")
    @Timed
    public ResponseEntity<List<Books>> searchBooks(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Books for query {}", query);
        Page<Books> page = booksService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/books");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
