package org.springframework.samples.petclinic.admin.dao;


import org.springframework.samples.petclinic.owner.Owner;
import org.springframework.samples.petclinic.owner.OwnerRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public class OwnerDao {

    private final OwnerRepository ownerRepository;

    public OwnerDao(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public Collection<org.springframework.samples.petclinic.owner.Owner> fetchAll() {
        return ownerRepository.findByLastName("");
    }


}
