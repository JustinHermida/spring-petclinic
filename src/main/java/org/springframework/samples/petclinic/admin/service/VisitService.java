package org.springframework.samples.petclinic.admin.service;

import org.springframework.samples.petclinic.admin.dao.VisitsDao;
import org.springframework.samples.petclinic.admin.domain.Visit;
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

    public void cancelVisit(Integer visitId) {
        visitsDao.cancelVisit(visitId);
    }

    private org.springframework.samples.petclinic.visit.Visit transform(Visit visit) {
        org.springframework.samples.petclinic.visit.Visit model = new org.springframework.samples.petclinic.visit.Visit();

        model.setId(visit.getId());
        model.setPetId(visit.getPetId());
        model.setVetId(visit.getVetId());
        model.setDate(visit.getVisitDate());
        model.setDescription(visit.getDescription());

        return model;
    }

    private Visit transform(org.springframework.samples.petclinic.visit.Visit model) {
        Visit domain = new Visit();
        domain.setId(model.getId());
        domain.setVetId(model.getVetId());
        domain.setPetId(model.getPetId());
        domain.setVisitDate(model.getDate());
        domain.setDescription(model.getDescription());

        return domain;
    }
}
