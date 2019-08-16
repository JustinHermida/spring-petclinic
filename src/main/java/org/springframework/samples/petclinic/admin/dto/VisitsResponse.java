package org.springframework.samples.petclinic.admin.dto;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
public class VisitsResponse {

    private List<VisitResponse> visits;

    @XmlElement
    public List<VisitResponse> getVisits() {
        return visits;
    }

    public void setVisits(List<VisitResponse> visits) {
        this.visits = visits;
    }
}
