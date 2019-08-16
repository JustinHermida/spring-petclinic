package org.springframework.samples.petclinic.admin.dto;

public class SpecialtyResponse {

    private String name;

    public SpecialtyResponse() {}

    public SpecialtyResponse(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
