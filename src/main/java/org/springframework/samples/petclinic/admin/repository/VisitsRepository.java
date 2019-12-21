package org.springframework.samples.petclinic.admin.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.samples.petclinic.visit.Visit;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface VisitsRepository extends Repository<Visit, Integer> {

    String FIND_CONFLICT_QUERY = "SELECT * from `visits` " +
        "WHERE `vet_id` = :vetId " +
        "AND `visit_date` = :visitDate " +
        "AND `time` = :time";

    String DELETE_STMT = "DELETE from `visits` " +
        "WHERE `vet_id` = :vetId " +
        "AND `visit_date` = :visitDate " +
        "AND `time` = :time";

    void save(Visit visit);

    void deleteById(Integer id);

    @Transactional(readOnly = true)
    List<Visit> findAll();

    @Query(value = FIND_CONFLICT_QUERY, nativeQuery = true)
    Visit findConflict(@Param("vetId") Integer vetId, @Param("visitDate") LocalDate visitDate, @Param("time") String time);

    @Transactional
    @Modifying
    @Query(value = DELETE_STMT, nativeQuery = true)
    void delete(@Param("vetId") Integer vetId, @Param("visitDate") LocalDate visitDate, @Param("time") String time);
}
