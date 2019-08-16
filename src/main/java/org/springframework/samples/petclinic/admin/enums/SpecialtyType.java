package org.springframework.samples.petclinic.admin.enums;

public enum SpecialtyType {
    RADIOLOGY(1, "radiology"),
    SURGERY(2, "surgery"),
    DENTISTRY(3, "dentistry");

    private int id;
    private String specialty;

    SpecialtyType(int id, String specialty) {
        this.id = id;
        this.specialty = specialty;
    }

    public static SpecialtyType fromString(String specialty) {
        for(SpecialtyType type : values()) {
            if(specialty.equalsIgnoreCase(type.getSpecialty())) {
                return type;
            }
        }

        return null;
    }

    public static SpecialtyType fromId(int id) {
        for(SpecialtyType type : values()) {
            if(type.getId() == type.getId()) {
                return type;
            }
        }

        return null;
    }

    public int getId() {
        return id;
    }

    public String getSpecialty() {
        return specialty;
    }
}
