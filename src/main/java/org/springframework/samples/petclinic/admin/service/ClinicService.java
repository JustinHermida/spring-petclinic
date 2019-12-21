package org.springframework.samples.petclinic.admin.service;

import org.springframework.samples.petclinic.admin.domain.Owner;
import org.springframework.samples.petclinic.admin.domain.Pet;
import org.springframework.samples.petclinic.admin.domain.Pets;
import org.springframework.samples.petclinic.admin.domain.Vet;
import org.springframework.samples.petclinic.admin.domain.VetSpecialty;
import org.springframework.samples.petclinic.admin.domain.Visit;
import org.springframework.samples.petclinic.admin.enums.SpecialtyType;
import org.springframework.samples.petclinic.exception.SchedulingConflictException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

@Service
public class ClinicService {

    private final VetService vetService;
    private final SpecialtyService specialtyService;
    private final OwnerService ownerService;
    private final PetService petService;
    private final VisitService visitService;

    public ClinicService(VetService vetService,
                         SpecialtyService specialtyService,
                         OwnerService ownerService,
                         PetService petService,
                         VisitService visitService) {
        this.vetService = vetService;
        this.specialtyService = specialtyService;
        this.ownerService = ownerService;
        this.petService = petService;
        this.visitService = visitService;
    }

    public List<Vet> fetchAllVets() {
        return vetService.fetchAllVets();
    }

    public void addVet(Vet vet) {
        Vet newVet = vetService.addVet(vet);

        if(vet.getSpecialties() != null) {
            for(String specialty : vet.getSpecialties()) {
                VetSpecialty vetSpecialty = new VetSpecialty();
                vetSpecialty.setVetId(newVet.getId());
                vetSpecialty.setSpecialtyId(SpecialtyType.fromString(specialty).getId());
                specialtyService.addSpecialtyToVet(vetSpecialty);
            }
        }
    }

    public List<Owner> fetchAllOwners() {
        return ownerService.fetchAll();
    }

    public void addPet(Pets pet) {
        petService.addPet(pet);
    }


    public List<Visit> fetchAllVisits() {
        return visitService.fetchAll();
    }

    public List<Pet> fetchAllPets() {
        return petService.fetchAll();
    }

    public Visit addVisit(Visit visit) {
        Visit conflict = visitService.findConflict(visit);

        if(conflict != null) {
            throw new SchedulingConflictException();
        }

        return visitService.addVisit(visit);
    }

    public Visit cancelVisit(Visit visit) {
        return visitService.cancelVisit(visit);
    }
}
