package org.springframework.samples.petclinic.admin.repository;

import org.springframework.dao.DataAccessException;
import org.springframework.data.repository.Repository;
import org.springframework.samples.petclinic.admin.model.PetsModel;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

public interface PetsRepository extends Repository<PetsModel, Integer> {

    @Transactional(readOnly = true)
    List<PetsModel> findAll() throws DataAccessException;

    void save(PetsModel model);
}
