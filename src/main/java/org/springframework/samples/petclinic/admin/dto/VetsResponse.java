package org.springframework.samples.petclinic.admin.dto;


import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
public class VetsResponse {

    private List<VetResponse> vets;

    @XmlElement
    public List<VetResponse> getVets() {
        return vets;
    }

    public void setVets(List<VetResponse> vets) {
        this.vets = vets;
    }
}
