package org.springframework.samples.petclinic.admin.service;

import org.springframework.samples.petclinic.admin.dao.OwnerDao;
import org.springframework.samples.petclinic.admin.domain.Owner;
import org.springframework.samples.petclinic.admin.domain.Pet;
import org.springframework.samples.petclinic.admin.domain.PetType;
import org.springframework.samples.petclinic.admin.domain.Visit;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class OwnerService {

    private final OwnerDao ownerDao;

    public OwnerService(OwnerDao ownerDao) {
        this.ownerDao = ownerDao;
    }

    public List<Owner> fetchAll() {
        Collection<org.springframework.samples.petclinic.owner.Owner> owners = ownerDao.fetchAll();

        return owners.stream()
                    .map(this::transform)
                    .collect(toList());
    }

    private Owner transform(org.springframework.samples.petclinic.owner.Owner owner) {
        Owner domain = new Owner();

        domain.setId(owner.getId());
        domain.setFirstName(owner.getFirstName());
        domain.setLastName(owner.getLastName());
        domain.setAddress(owner.getAddress());
        domain.setCity(owner.getCity());
        domain.setTelephone(owner.getTelephone());
        domain.setPets(owner.getPets().stream().map(this::transform).collect(Collectors.toSet()));

        return domain;
    }

    private Pet transform(org.springframework.samples.petclinic.owner.Pet pet) {
        Pet domain = new Pet();
        domain.setId(pet.getId());
        domain.setName(pet.getName());
        domain.setBirthDate(pet.getBirthDate());


        PetType petType = new PetType();
        petType.setId(pet.getType().getId());
        petType.setName(pet.getType().getName());
        domain.setPetType(petType);

        domain.setVisits(pet.getVisits() != null ?
            pet.getVisits().stream()
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
