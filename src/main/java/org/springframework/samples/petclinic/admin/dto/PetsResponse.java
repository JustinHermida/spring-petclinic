package org.springframework.samples.petclinic.admin.dto;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
public class PetsResponse {

    @XmlElement
    private List<PetResponse> pets;

    public List<PetResponse> getPets() {
        return pets;
    }

    public void setPets(List<PetResponse> pets) {
        this.pets = pets;
    }
}
