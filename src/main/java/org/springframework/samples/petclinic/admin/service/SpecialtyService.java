package org.springframework.samples.petclinic.admin.service;


import org.springframework.samples.petclinic.admin.dao.VetSpecialtiesDao;
import org.springframework.samples.petclinic.admin.domain.VetSpecialty;
import org.springframework.samples.petclinic.admin.model.VetSpecialtyModel;
import org.springframework.stereotype.Service;

@Service
public class SpecialtyService {

    private final VetSpecialtiesDao vetSpecialtiesDao;

    public SpecialtyService(VetSpecialtiesDao vetSpecialtiesDao) {
        this.vetSpecialtiesDao = vetSpecialtiesDao;
    }

    public void addSpecialtyToVet(VetSpecialty vetSpecialty) {
        VetSpecialtyModel vetSpecialtyModel = new VetSpecialtyModel();
        vetSpecialtyModel.setVetId(vetSpecialty.getVetId());
        vetSpecialtyModel.setSpecialtyId(vetSpecialty.getSpecialtyId());

        vetSpecialtiesDao.addSpecialtyToVet(vetSpecialtyModel);
    }
}
