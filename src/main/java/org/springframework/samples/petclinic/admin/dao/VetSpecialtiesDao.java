package org.springframework.samples.petclinic.admin.dao;

import org.springframework.samples.petclinic.admin.model.VetSpecialtyModel;
import org.springframework.samples.petclinic.admin.repository.VetSpecialtyRepository;
import org.springframework.stereotype.Repository;

@Repository
public class VetSpecialtiesDao {

    private final VetSpecialtyRepository vetSpecialtyRepository;

    public VetSpecialtiesDao(VetSpecialtyRepository vetSpecialtyRepository) {
        this.vetSpecialtyRepository = vetSpecialtyRepository;
    }

    public void addSpecialtyToVet(VetSpecialtyModel vetSpecialtyModel) {
        vetSpecialtyRepository.save(vetSpecialtyModel);
    }
}
