package org.springframework.samples.petclinic.admin.controller;

import org.springframework.samples.petclinic.admin.domain.Owner;
import org.springframework.samples.petclinic.admin.domain.Pet;
import org.springframework.samples.petclinic.admin.domain.Pets;
import org.springframework.samples.petclinic.admin.domain.Vet;
import org.springframework.samples.petclinic.admin.domain.Visit;
import org.springframework.samples.petclinic.admin.dto.OwnerResponse;
import org.springframework.samples.petclinic.admin.dto.OwnersResponse;
import org.springframework.samples.petclinic.admin.dto.PetRequest;
import org.springframework.samples.petclinic.admin.dto.PetResponse;
import org.springframework.samples.petclinic.admin.dto.PetsResponse;
import org.springframework.samples.petclinic.admin.dto.VetRequest;
import org.springframework.samples.petclinic.admin.dto.VetResponse;
import org.springframework.samples.petclinic.admin.dto.VetsResponse;
import org.springframework.samples.petclinic.admin.dto.VisitRequest;
import org.springframework.samples.petclinic.admin.dto.VisitResponse;
import org.springframework.samples.petclinic.admin.dto.VisitsResponse;
import org.springframework.samples.petclinic.admin.service.ClinicService;
import org.springframework.samples.petclinic.visit.VetAppointmentId;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Controller
public class AdminController {

    private static final String ADMIN_LOGIN = "admins/login";
    private static final String ADMIN_VETS = "admins/vets";
    private static final String ADMIN_OWNER = "admins/owners";
    private static final String ADMIN_APPOINTMENTS = "admins/appointments";

    //private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/d");

    private final ClinicService clinicService;

    public AdminController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }


    @GetMapping("/admin/login.html")
    public String loginForm() {
        return ADMIN_LOGIN;
    }

    @GetMapping("/admin/vets.html")
    public String vetPage() {
        return ADMIN_VETS;
    }

    @GetMapping("/admin/owners.html")
    public String ownersPage() {
        return ADMIN_OWNER;
    }

    @GetMapping("/admin/appointments.html")
    public String appointmentsPage() {
        //this.ownerRepository.findByLastName(null);
        return ADMIN_APPOINTMENTS;
    }

    @GetMapping("/admin/vets")
    public @ResponseBody VetsResponse getAllVets() {
        List<Vet> vets = clinicService.fetchAllVets();

        VetsResponse response = new VetsResponse();
        response.setVets(vets.stream().map(this::transform).collect(toList()));

        return response;
    }

    @PostMapping("/admin/vets")
    public @ResponseBody Vet addVet(@RequestBody VetRequest vetRequest) {

        Vet vet = new Vet();
        vet.setFirstName(vetRequest.getFirstName());
        vet.setLastName(vetRequest.getLastName());
        vet.setSpecialties(vetRequest.getSpecialties());

        clinicService.addVet(vet);

        return vet;
    }

    @PostMapping("/admin/pets")
    public @ResponseBody void addPet(@RequestBody PetRequest petRequest) {
        Pets pets = new Pets();
        pets.setName(petRequest.getName());
        pets.setBirthDate(LocalDate.parse(petRequest.getBirthDate()));
        pets.setOwnerId(petRequest.getOwnerId());
        pets.setTypeId(petRequest.getTypeId());

        clinicService.addPet(pets);
    }

    @GetMapping("/admin/pets")
    public @ResponseBody PetsResponse getAllPets() {
        List<Pet> pets = clinicService.fetchAllPets();

        PetsResponse response = new PetsResponse();
        response.setPets(pets.stream().map(this::transform).collect(toList()));

        return response;
    }

    @GetMapping("/admin/owners")
    public @ResponseBody OwnersResponse getAllOwners() {
        List<Owner> owners = clinicService.fetchAllOwners();

        OwnersResponse response = new OwnersResponse();
        response.setOwners(owners.stream().map(this::transform).collect(toList()));

        return response;
    }

    @GetMapping("/admin/visits")
    public @ResponseBody VisitsResponse getAllVisits() {
        List<Visit> visits = clinicService.fetchAllVisits();

        List<VisitResponse> responseList = visits.stream()
            .map(this::transform)
            .collect(toList());

        VisitsResponse response = new VisitsResponse();
        response.setVisits(responseList);

        return response;
    }

    @DeleteMapping("/admin/visits")
    public @ResponseBody VisitResponse cancelVisit(@RequestBody VisitRequest visitRequest) {

        Visit visit = clinicService.cancelVisit(transform(visitRequest));

        return transform(visit);
    }

    @PostMapping("/admin/visits")
    public @ResponseBody VisitResponse addVisit(@RequestBody VisitRequest visitRequest) { ;
        Visit visit = clinicService.addVisit(transform(visitRequest));

        return transform(visit);
    }

    private Visit transform(VisitRequest request) {
        Visit domain = new Visit();

        domain.setPetId(request.getPetId());
        domain.setVetId(request.getVetId());
        domain.setTime(request.getTime());
        domain.setVisitDate(LocalDate.parse(request.getVisitDate()));
        domain.setDescription(request.getDescription());

        return domain;
    }
    private VetResponse transform(Vet vet) {
        VetResponse response = new VetResponse();
        response.setId(vet.getId());
        response.setFirstName(vet.getFirstName());
        response.setLastName(vet.getLastName());
        response.setSpecialties(vet.getSpecialties() != null && !vet.getSpecialties().isEmpty() ?
            vet.getSpecialties() :
            new HashSet<String>(){{ add("none"); }});

        return response;
    }

    private OwnerResponse transform(Owner owner) {
        OwnerResponse response = new OwnerResponse();
        response.setId(owner.getId());
        response.setFirstName(owner.getFirstName());
        response.setLastName(owner.getLastName());
        response.setAddress(owner.getAddress());
        response.setCity(owner.getCity());
        response.setTelephone(owner.getTelephone());
        response.setPets(owner.getPets().stream().map(this::transform).collect(Collectors.toSet()));

        return response;
    }

    private PetResponse transform(Pet pet) {
        PetResponse response = new PetResponse();
        response.setId(pet.getId());
        response.setName(pet.getName());
        response.setBirthDate(pet.getBirthDate());
        response.setTypeId(pet.getPetType().getId());
        response.setVisits(pet.getVisits() != null && !pet.getVisits().isEmpty() ?
            pet.getVisits().stream().map(this::transform).collect(toList()) : null);
        response.setOwnerId(pet.getOwnerId());

        return response;
    }

    private VisitResponse transform(Visit visit) {
        VisitResponse response = new VisitResponse();

        response.setPetId(visit.getPetId());
        response.setVetId(visit.getVetId());
        response.setVisitDate(visit.getVisitDate());
        response.setTime(visit.getTime());
        response.setDescription(visit.getDescription());

        return response;
    }

}
