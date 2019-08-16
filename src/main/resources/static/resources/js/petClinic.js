(function petClinicIIFE(window, $, doT) {
    "use strict";

    var petClinic;

    /**
     * Check whether all required elements of a component are available.
     * @param selectors
     * @returns {boolean}
     * @private
     */
    function _isComponentReady(selectors) {
        var prop;

        if (!document.body) {
            return false;
        }

        if (!selectors) {
            return true;
        } else if (typeof selectors === "string") {
            selectors = { key: selectors };
        }

        for (prop in selectors) {
            if (selectors.hasOwnProperty(prop) && !$(selectors[prop]).length) {
                return false;
            }
        }

        return true;
    }

    function _renderTemplate(name, params) {
        var template = {
            vetTable: "<table id='vets' class='table table-striped'>" +
                "<thead>" +
                "<tr>" +
                "<th style='width: 75px;'>Vet Id</th>" +
                "<th>Name</th>" +
                "<th>Specialties</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody>" +
                "{{~it.vetList :vet}}" +
                "<tr>" +
                "<td>{{=vet.id}}</td>" +
                "<td><a href='#' class='js-vet' data-vet-id='{{=vet.id}}'>{{=vet.firstName}} {{=vet.lastName}}</a></td>" +
                "<td>" +
                "{{~vet.specialties :specialty}}" +
                "{{=specialty}} " +
                "{{~}}" +
                "</td>" +
                "</tr>" +
                "{{~}}" +
                "</tbody>" +
                "</table>",
            ownerTable: "<table id='ownersTable' class='table table-striped'>" +
                "<thead>" +
                "<tr>" +
                "<th style='width: 100px;'>Owner Id</th>" +
                "<th style='width: 150px;'>Name</th>" +
                "<th style='width: 200px;'>Address</th>" +
                "<th>City</th>" +
                "<th style='width: 120px'>Telephone</th>" +
                "<th>Pets</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody>" +
                "{{~it.ownerList :owner}}" +
                "<tr>" +
                "<td>{{=owner.id}}</td>" +
                "<td><a href='#' class='js-owner'>{{=owner.firstName}} {{=owner.lastName}}</a></td>" +
                "<td>{{=owner.address}}</td>" +
                "<td>{{=owner.city}}</td>" +
                "<td>{{=owner.telephone}}</td>" +
                "<td><a href='#' class='js-add-pet'><span class='glyphicon glyphicon-plus'></span></a> " +
                "{{~owner.pets :pet}}" +
                "<a href='#' data-owner-id='{{=owner.id}}' data-pet-id='{{=pet.id}}' data-birth-date='{{=pet.birthDate}}' data-pet-type='{{=pet.typeId}}' class='js-pet'>{{=pet.name}}</a> " +
                "{{~}}" +
                "</td>" +
                "</tr>" +
                "{{~}}" +
                "</tbody>" +
                "</table>"
        };

        var dotTemplate = doT.template(template[name]);
        var renderedTemplate = dotTemplate(params);

        return $(renderedTemplate);
    }

    petClinic = {};

    petClinic.initComponent = function initComponent(selectors, whenReady, componentName) {
        if(_isComponentReady(selectors)) {
            whenReady();
        } else {
            $(document).ready(function onDomReady() {
                // make sure all the elements exists before calling
                // the init function
                if (!_isComponentReady(selectors)) {
                    //throw new window.Error("Required DOM elements are missing for component " + componentName);
                    window.console.log("Required DOM elements are missing for component");
                } else {
                    whenReady();
                }
            });
        }
    };

    petClinic.renderTemplate = _renderTemplate;

    window.petClinic = petClinic;

})(window, window.jQuery, window.doT);
