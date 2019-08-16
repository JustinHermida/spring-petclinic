package org.springframework.samples.petclinic.admin.dto;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
public class OwnersResponse {
    private List<OwnerResponse> owners;

    @XmlElement
    public List<OwnerResponse> getOwners() {
        return owners;
    }

    public void setOwners(List<OwnerResponse> owners) {
        this.owners = owners;
    }
}
