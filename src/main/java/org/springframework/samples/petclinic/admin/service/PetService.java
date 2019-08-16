package org.springframework.samples.petclinic.admin.service;

import org.springframework.samples.petclinic.admin.dao.PetDao;
import org.springframework.samples.petclinic.admin.domain.Pet;
import org.springframework.samples.petclinic.admin.domain.PetType;
import org.springframework.samples.petclinic.admin.domain.Pets;
import org.springframework.samples.petclinic.admin.domain.Visit;
import org.springframework.samples.petclinic.admin.model.PetsModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class PetService {

    private final PetDao petDao;

    public PetService(PetDao petDao) {
        this.petDao = petDao;
    }

    public void addPet(Pets pet) {
        PetsModel model = transform(pet);
        petDao.addPet(model);
    }

    public List<Pet> fetchAll() {
        List<org.springframework.samples.petclinic.owner.Pet> petModels = petDao.fetchAll();

        return petModels.stream()
            .map(this::transform)
            .collect(toList());
    }

    private PetsModel transform(Pets pet) {
        PetsModel model = new PetsModel();
        model.setId(pet.getId());
        model.setName(pet.getName());
        model.setBirthDate(pet.getBirthDate());
        model.setTypeId(pet.getTypeId());
        model.setOwnerId(pet.getOwnerId());

        return model;
    }

    private Pet transform(org.springframework.samples.petclinic.owner.Pet model) {
        Pet domain = new Pet();
        domain.setId(model.getId());
        domain.setName(model.getName());
        domain.setBirthDate(model.getBirthDate());
        PetType petType = new PetType();
        petType.setId(model.getType().getId());
        petType.setName(model.getType().getName());
        domain.setPetType(petType);

        domain.setOwnerId(model.getOwner().getId());
        domain.setVisits(model.getVisits() != null ?
            model.getVisits().stream()
                .map(this::transform)
                .collect(toList()) :
            null);

        return domain;
    }

    private Visit transform(org.springframework.samples.petclinic.visit.Visit visit) {
        Visit domain = new Visit();
        domain.setId(visit.getId());
        domain.setPetId(visit.getPetId());
        domain.setVisitDate(visit.getDate());
        domain.setDescription(visit.getDescription());

        return domain;
    }


}
