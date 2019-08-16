package org.springframework.samples.petclinic.admin.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vet_specialties")
public class VetSpecialtyModel {

    @Id
    @Column(name = "vet_id")
    private Integer vetId;

    @Column(name = "specialty_id")
    private Integer specialtyId;

    public Integer getVetId() {
        return vetId;
    }

    public void setVetId(Integer vetId) {
        this.vetId = vetId;
    }

    public Integer getSpecialtyId() {
        return specialtyId;
    }

    public void setSpecialtyId(Integer specialtyId) {
        this.specialtyId = specialtyId;
    }
}
