package org.springframework.samples.petclinic.admin.service;

import org.springframework.samples.petclinic.admin.dao.VetDao;
import org.springframework.samples.petclinic.admin.domain.Vet;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class VetService {

    private final VetDao vetDao;

    public VetService(VetDao vetDao) {
        this.vetDao = vetDao;
    }

    public List<Vet> fetchAllVets() {
        Collection<org.springframework.samples.petclinic.vet.Vet> vets = vetDao.fetchAllVets();

        return vets.stream()
            .map(vet -> transform(vet))
            .collect(toList());
    }

    public Vet addVet(Vet vet) {
        // convert it to the persistence model.
        org.springframework.samples.petclinic.vet.Vet vetModal = new org.springframework.samples.petclinic.vet.Vet();
        vetModal.setFirstName(vet.getFirstName());
        vetModal.setLastName(vet.getLastName());

        org.springframework.samples.petclinic.vet.Vet newVet = vetDao.add(vetModal);
        vet.setId(newVet.getId());

        return vet;
    }

    private Vet transform(org.springframework.samples.petclinic.vet.Vet vetModel) {
        Vet vet = new Vet();
        vet.setId(vetModel.getId());
        vet.setFirstName(vetModel.getFirstName());
        vet.setLastName(vetModel.getLastName());
        vet.setSpecialties(vetModel.getSpecialties() != null ?
            vetModel.getSpecialties()
                .stream()
                .map(specialty -> specialty.getName()).collect(Collectors.toSet())
            : null);

        return vet;
    }
}
