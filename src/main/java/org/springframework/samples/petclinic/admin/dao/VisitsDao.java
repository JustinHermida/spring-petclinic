package org.springframework.samples.petclinic.admin.dao;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.samples.petclinic.admin.repository.VisitsRepository;
import org.springframework.samples.petclinic.visit.Visit;
import org.springframework.samples.petclinic.visit.VisitRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class VisitsDao {

    private final VisitRepository visitRepository;
    private final VisitsRepository visitsRepository;

    public VisitsDao(VisitRepository visitRepository,
                     VisitsRepository visitsRepository) {
        this.visitRepository = visitRepository;
        this.visitsRepository = visitsRepository;
    }

    public List<Visit> fetchAllVisits() {
        return visitsRepository.findAll();
    }

    public void addVisit(Visit visit) {
        visitsRepository.save(visit);
    }

    public void cancelVisit(Integer visitId) {
        try {
            visitsRepository.deleteById(visitId);
        } catch(EmptyResultDataAccessException e) {
            // do nothing.
        }
    }

    public Visit findConflict(Integer vetId, LocalDate visitDate, String time) {
        return visitsRepository.findConflict(vetId, visitDate, time);
    }

    public void cancelVisit(Integer vetId, LocalDate visitDate, String time) {
        visitsRepository.delete(vetId, visitDate, time);
    }
}
