package org.springframework.samples.petclinic.admin.dao;

import org.springframework.samples.petclinic.admin.model.PetsModel;
import org.springframework.samples.petclinic.admin.repository.PetsRepository;
import org.springframework.samples.petclinic.owner.Pet;
import org.springframework.samples.petclinic.owner.PetRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PetDao {
    private final PetRepository petRepository;
    private final PetsRepository petsRepository;

    public PetDao(PetRepository petRepository, PetsRepository petsRepository) {
        this.petRepository = petRepository;
        this.petsRepository = petsRepository;
    }

    public void addPet(PetsModel pet) {
        petsRepository.save(pet);
    }

    public List<Pet> fetchAll() {
        return petRepository.findAll();
    }
}
