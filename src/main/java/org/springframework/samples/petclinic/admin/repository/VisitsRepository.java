package org.springframework.samples.petclinic.admin.repository;

import org.springframework.data.repository.Repository;
import org.springframework.samples.petclinic.visit.Visit;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface VisitsRepository extends Repository<Visit, Integer> {

    void save(Visit visit);

    void deleteById(Integer id);

    List<Visit> findByVetId(Integer vetId);

    @Transactional(readOnly = true)
    List<Visit> findAll();
}
