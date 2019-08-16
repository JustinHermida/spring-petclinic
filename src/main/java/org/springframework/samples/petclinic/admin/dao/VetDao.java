package org.springframework.samples.petclinic.admin.dao;

import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public class VetDao {

    private final VetRepository vetRepository;


    public VetDao(VetRepository vetRepository) {
        this.vetRepository = vetRepository;
    }

    public Collection<Vet> fetchAllVets() {
        return vetRepository.findAll();
    }

    public Vet add(Vet vet) {
        vetRepository.save(vet);
        return vet;
    }
}
