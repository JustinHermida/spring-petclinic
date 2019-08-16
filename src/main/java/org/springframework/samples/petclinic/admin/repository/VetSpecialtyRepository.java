package org.springframework.samples.petclinic.admin.repository;

import org.springframework.dao.DataAccessException;
import org.springframework.data.repository.Repository;
import org.springframework.samples.petclinic.admin.model.VetSpecialtyModel;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

public interface VetSpecialtyRepository extends Repository<VetSpecialtyModel, Integer> {

    @Transactional(readOnly = true)
    Collection<VetSpecialtyModel> findAll() throws DataAccessException;

    void save(VetSpecialtyModel vetSpecialtyModel);
}
