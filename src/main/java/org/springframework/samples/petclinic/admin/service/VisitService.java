package org.springframework.samples.petclinic.admin.service;

import org.springframework.samples.petclinic.admin.dao.VisitsDao;
import org.springframework.samples.petclinic.admin.domain.Visit;
import org.springframework.samples.petclinic.visit.VetAppointmentId;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class VisitService {

    private final VisitsDao visitsDao;

    public VisitService(VisitsDao visitsDao) {
        this.visitsDao = visitsDao;
    }

    public List<Visit> fetchAll() {
        return visitsDao.fetchAllVisits().stream()
            .map(this::transform)
            .collect(toList());
    }

    public Visit addVisit(Visit visit) {
        org.springframework.samples.petclinic.visit.Visit model = transform(visit);
        visitsDao.addVisit(model);
        return transform(model);
    }

    public Visit findConflict(Visit visit) {
        return transform(visitsDao.findConflict(visit.getVetId(), visit.getVisitDate(), visit.getTime()));
    }

    public Visit cancelVisit(Visit visit) {
        visitsDao.cancelVisit(visit.getVetId(), visit.getVisitDate(), visit.getTime());
        return visit;
    }

    private org.springframework.samples.petclinic.visit.Visit transform(Visit visit) {
        org.springframework.samples.petclinic.visit.Visit model = new org.springframework.samples.petclinic.visit.Visit();

        VetAppointmentId vetApptId = new VetAppointmentId();
        vetApptId.setVetId(visit.getVetId());
        vetApptId.setDate(visit.getVisitDate());
        vetApptId.setTime(visit.getTime());

        model.setId(vetApptId);
        model.setPetId(visit.getPetId());
        model.setDescription(visit.getDescription());

        return model;
    }

    private Visit transform(org.springframework.samples.petclinic.visit.Visit model) {
        if(model == null) {
            return null;
        }

        VetAppointmentId vetApptId = model.getId();

        Visit domain = new Visit();
        domain.setVetId(vetApptId.getVetId());
        domain.setPetId(model.getPetId());
        domain.setVisitDate(vetApptId.getDate());
        domain.setTime(vetApptId.getTime());
        domain.setDescription(model.getDescription());

        return domain;
    }
}
