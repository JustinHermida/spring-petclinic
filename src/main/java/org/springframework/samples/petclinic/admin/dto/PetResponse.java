package org.springframework.samples.petclinic.admin.dto;

import javax.xml.bind.annotation.XmlRootElement;
import java.time.LocalDate;
import java.util.List;

@XmlRootElement
public class PetResponse {
    private Integer id;
    private String name;
    private LocalDate birthDate;
    private Integer typeId;
    private Integer ownerId;
    private List<VisitResponse> visits;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public Integer getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Integer ownerId) {
        this.ownerId = ownerId;
    }

    public List<VisitResponse> getVisits() {
        return visits;
    }

    public void setVisits(List<VisitResponse> visits) {
        this.visits = visits;
    }
}
