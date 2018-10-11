package org.sid.myapp1.repository;

import org.sid.myapp1.domain.Books;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Books entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BooksRepository extends JpaRepository<Books, Long> {

}
