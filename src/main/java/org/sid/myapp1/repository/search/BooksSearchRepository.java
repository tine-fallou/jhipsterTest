package org.sid.myapp1.repository.search;

import org.sid.myapp1.domain.Books;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Books entity.
 */
public interface BooksSearchRepository extends ElasticsearchRepository<Books, Long> {
}
