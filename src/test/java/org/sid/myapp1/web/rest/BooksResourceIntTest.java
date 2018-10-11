package org.sid.myapp1.web.rest;

import org.sid.myapp1.PressingApp;

import org.sid.myapp1.domain.Books;
import org.sid.myapp1.repository.BooksRepository;
import org.sid.myapp1.repository.search.BooksSearchRepository;
import org.sid.myapp1.service.BooksService;
import org.sid.myapp1.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


import static org.sid.myapp1.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BooksResource REST controller.
 *
 * @see BooksResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PressingApp.class)
public class BooksResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    @Autowired
    private BooksRepository booksRepository;

    

    @Autowired
    private BooksService booksService;

    /**
     * This repository is mocked in the org.sid.myapp1.repository.search test package.
     *
     * @see org.sid.myapp1.repository.search.BooksSearchRepositoryMockConfiguration
     */
    @Autowired
    private BooksSearchRepository mockBooksSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restBooksMockMvc;

    private Books books;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BooksResource booksResource = new BooksResource(booksService);
        this.restBooksMockMvc = MockMvcBuilders.standaloneSetup(booksResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Books createEntity(EntityManager em) {
        Books books = new Books()
            .name(DEFAULT_NAME)
            .author(DEFAULT_AUTHOR);
        return books;
    }

    @Before
    public void initTest() {
        books = createEntity(em);
    }

    @Test
    @Transactional
    public void createBooks() throws Exception {
        int databaseSizeBeforeCreate = booksRepository.findAll().size();

        // Create the Books
        restBooksMockMvc.perform(post("/api/books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(books)))
            .andExpect(status().isCreated());

        // Validate the Books in the database
        List<Books> booksList = booksRepository.findAll();
        assertThat(booksList).hasSize(databaseSizeBeforeCreate + 1);
        Books testBooks = booksList.get(booksList.size() - 1);
        assertThat(testBooks.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBooks.getAuthor()).isEqualTo(DEFAULT_AUTHOR);

        // Validate the Books in Elasticsearch
        verify(mockBooksSearchRepository, times(1)).save(testBooks);
    }

    @Test
    @Transactional
    public void createBooksWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = booksRepository.findAll().size();

        // Create the Books with an existing ID
        books.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBooksMockMvc.perform(post("/api/books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(books)))
            .andExpect(status().isBadRequest());

        // Validate the Books in the database
        List<Books> booksList = booksRepository.findAll();
        assertThat(booksList).hasSize(databaseSizeBeforeCreate);

        // Validate the Books in Elasticsearch
        verify(mockBooksSearchRepository, times(0)).save(books);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = booksRepository.findAll().size();
        // set the field null
        books.setName(null);

        // Create the Books, which fails.

        restBooksMockMvc.perform(post("/api/books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(books)))
            .andExpect(status().isBadRequest());

        List<Books> booksList = booksRepository.findAll();
        assertThat(booksList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAuthorIsRequired() throws Exception {
        int databaseSizeBeforeTest = booksRepository.findAll().size();
        // set the field null
        books.setAuthor(null);

        // Create the Books, which fails.

        restBooksMockMvc.perform(post("/api/books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(books)))
            .andExpect(status().isBadRequest());

        List<Books> booksList = booksRepository.findAll();
        assertThat(booksList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBooks() throws Exception {
        // Initialize the database
        booksRepository.saveAndFlush(books);

        // Get all the booksList
        restBooksMockMvc.perform(get("/api/books?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(books.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())));
    }
    

    @Test
    @Transactional
    public void getBooks() throws Exception {
        // Initialize the database
        booksRepository.saveAndFlush(books);

        // Get the books
        restBooksMockMvc.perform(get("/api/books/{id}", books.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(books.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingBooks() throws Exception {
        // Get the books
        restBooksMockMvc.perform(get("/api/books/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBooks() throws Exception {
        // Initialize the database
        booksService.save(books);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockBooksSearchRepository);

        int databaseSizeBeforeUpdate = booksRepository.findAll().size();

        // Update the books
        Books updatedBooks = booksRepository.findById(books.getId()).get();
        // Disconnect from session so that the updates on updatedBooks are not directly saved in db
        em.detach(updatedBooks);
        updatedBooks
            .name(UPDATED_NAME)
            .author(UPDATED_AUTHOR);

        restBooksMockMvc.perform(put("/api/books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBooks)))
            .andExpect(status().isOk());

        // Validate the Books in the database
        List<Books> booksList = booksRepository.findAll();
        assertThat(booksList).hasSize(databaseSizeBeforeUpdate);
        Books testBooks = booksList.get(booksList.size() - 1);
        assertThat(testBooks.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBooks.getAuthor()).isEqualTo(UPDATED_AUTHOR);

        // Validate the Books in Elasticsearch
        verify(mockBooksSearchRepository, times(1)).save(testBooks);
    }

    @Test
    @Transactional
    public void updateNonExistingBooks() throws Exception {
        int databaseSizeBeforeUpdate = booksRepository.findAll().size();

        // Create the Books

        // If the entity doesn't have an ID, it will throw BadRequestAlertException 
        restBooksMockMvc.perform(put("/api/books")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(books)))
            .andExpect(status().isBadRequest());

        // Validate the Books in the database
        List<Books> booksList = booksRepository.findAll();
        assertThat(booksList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Books in Elasticsearch
        verify(mockBooksSearchRepository, times(0)).save(books);
    }

    @Test
    @Transactional
    public void deleteBooks() throws Exception {
        // Initialize the database
        booksService.save(books);

        int databaseSizeBeforeDelete = booksRepository.findAll().size();

        // Get the books
        restBooksMockMvc.perform(delete("/api/books/{id}", books.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Books> booksList = booksRepository.findAll();
        assertThat(booksList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Books in Elasticsearch
        verify(mockBooksSearchRepository, times(1)).deleteById(books.getId());
    }

    @Test
    @Transactional
    public void searchBooks() throws Exception {
        // Initialize the database
        booksService.save(books);
        when(mockBooksSearchRepository.search(queryStringQuery("id:" + books.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(books), PageRequest.of(0, 1), 1));
        // Search the books
        restBooksMockMvc.perform(get("/api/_search/books?query=id:" + books.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(books.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Books.class);
        Books books1 = new Books();
        books1.setId(1L);
        Books books2 = new Books();
        books2.setId(books1.getId());
        assertThat(books1).isEqualTo(books2);
        books2.setId(2L);
        assertThat(books1).isNotEqualTo(books2);
        books1.setId(null);
        assertThat(books1).isNotEqualTo(books2);
    }
}
