(function vetsIIFE(window, $, doT, moment, petClinic) {
    "use strict";

    var SELECTORS, vetsCache = {}, visitsCache = {}, petsCache = {};

    function _onDomReady() {
        _buildInitialPage();

        $(SELECTORS.vets).on('click', '.js-vet', _individualVetClicked);
        $(SELECTORS.addVetButton).on('click', _addVet);
        $("#vetDetailsModal").on('click', '#addVetApptButton', _addAppointment);
        $("#vetDetailsModal").on('click', '#datePicker', _datePicker);
        $("#vetDetailsModal").on('click', '#timePicker', _timePicker);
        $("#vetDetailsModal").on('click', '.js-schedule-appt', _scheduleAppt);
        $("#vetDetailsModal").on('click', '.js-cancel-appt', _cancelVisit);

    }

    function _buildInitialPage() {

        // Initialize the cache.
        $.when(_fetchAllVets()).done(_renderVetsPage);
        $.when(_fetchAllVisits()).done(_saveVisitsToCache);
        $.when(_fetchAllPets()).done(_savePetsToCache);
    }

    function _renderVetsPage(vets) {

        _saveVetsToCache(vets.vets);

        var $vetsTable = petClinic.renderTemplate("vetTable", {
            vetList: vets.vets
        });

        $vetsTable.appendTo($(SELECTORS.vets));
        var $addVetButton = $("<a class=\"btn btn-default\" data-toggle=\"modal\" data-target=\"#addVetModal\">Add Vet</a>");

        $addVetButton.appendTo($vetsTable);
    }

    function _savePetsToCache(response) {
        var pets = response.pets;

        for(var i = 0; i < pets.length; i++) {
            petsCache[pets[i].id] = pets[i];
        }
    }

    function _saveVetsToCache(vets) {
        for(var i = 0; i < vets.length; i++) {
            vetsCache[vets[i].id] = vets[i];
        }
    }

    function _addAppointment(event) {
        var $target = $(event.target.parentElement);
        var vetId = $("#addAppointmentButton").attr("data-vet-id");

        var $vetApptsTableBody = $("#vetApptsTableBody");
        var $tr = $("<tr></tr>");

        var $dateInput = $("<input class=\"form-control\" id=\"datePicker\" name=\"date\" placeholder=\"MM-DD-YYY\" type=\"text\"/>");
        var $startTimeInput = $("<input type=\"text\" id=\"timePicker\" class=\"form-control timePicker\" autocomplete=\"off\"/>");
        var $scheduleButton = $("<button type=\"button\" class=\"btn btn-success js-schedule-appt\">Schedule</button>");
        $scheduleButton.attr({"data-vet-id": vetId});
        var $descriptionInput = $("<input type=\"text\" id=\"visitDescription\" class=\"form-control\"/>");


        var $divDropDown = $("<div class=\"dropdown\">");
        var $buttonDropDown = $("<button class=\"btn btn-secondary dropdown-toggle\" " +
            "type=\"button\" id=\"dropdownMenuButton\" " +
            "data-toggle=\"dropdown\" " +
            "aria-haspopup=\"true\" " +
            "aria-expanded=\"false\"></button>");
        $buttonDropDown.text("Pet Name");

        $divDropDown.append($buttonDropDown);

        var $ulMenuButton = $("<ul id=\"petNameDropDown\" class=\"dropdown-menu\"></ul>");

        for (var petId in petsCache) {
            if (petsCache.hasOwnProperty(petId)) {
                var $li = $("<li></li>");
                var $label = $("<label></label>");
                var $input = $("<input type=\"radio\" name=\"petName\" value=\"" + petsCache[petId].id + "\"/>");

                $label.append($input);
                $label.append("&nbsp;" + petsCache[petId].name);

                $li.append($label);

                $ulMenuButton.append($li);
            }
        }

        $divDropDown.append($ulMenuButton);

        $tr.append($("<td></td>").append($dateInput));
        $tr.append($("<td></td>").append($startTimeInput));
        $tr.append($("<td></td>").append($divDropDown));
        $tr.append($("<td></td>").append($descriptionInput));
        $tr.append($("<td></td>").append($scheduleButton));

        $vetApptsTableBody.prepend($tr);
    }


    function _cancelVisit(event) {
        var $target = $(event.target);
        var visitId = $target.attr("data-visit-id");

        $.when(_cancelAppointment(visitId).done(_removeVisitFromModal));
    }

    function _cancelAppointment(visitId) {

        var options = {
            type: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            url: "visits/" + visitId
        };

        return $.ajax(options);
    }

    function _removeVisitFromModal(response) {
        var visitIdDeleted = response.id;
        var $vetDetailsModal = $("#vetDetailsModal");
        var $visit = $vetDetailsModal.find("tr[data-visit-id=" + visitIdDeleted + "]");
        $visit.remove();
    }

    function _saveVisitsToCache(response) {
        console.log(response);

        var visits = response.visits;
        for(var i = 0; i < visits.length; i++) {
            var visit = visits[i];

            if(visitsCache[visit.vetId] === undefined) {
                visitsCache[visit.vetId] = [visits[i]];
            } else {
                visitsCache[visit.vetId].push(visits[i]);
            }
        }

        console.log(visitsCache);
    }

    function _scheduleAppt() {
        var $target = $(event.target);
        var vetId = $target.attr("data-vet-id");
        var $datePicker = $("#datePicker");
        var $timePicker = $("#timePicker");
        var $visitDescription = $("#visitDescription");
        var $petSelected = $("#petNameDropDown").find("input[name='petName']:checked");

        var params = {
            petId: $petSelected.val(),
            visitDate: $datePicker.val(),
            vetId: vetId,
            time: $timePicker.val(),
            description: $visitDescription.val()
        };

        $.when(_scheduleVisit(params)).done(_visitComplete);
    }

    function _visitComplete(response) {
        console.log(response);

        var visitDate = response.visitDate;
        var today = moment();
        var momentVisitDate = moment(visitDate);

        var $tr = $("#vetApptsTableBody").find("tr:first");
        $tr.attr({"data-visit-id": response.id, "data-pet-id": response.petId});
        $tr.empty();

        $tr.append($("<td></td>").text(visitDate));
        $tr.append($("<td></td>").text("10:00am"));
        $tr.append($("<td></td>").text(petsCache[response.petId].name));
        $tr.append($("<td></td>").text(response.description));

        if(momentVisitDate.isBefore(today)) {
            $tr.append($("<td></td>"));
        } else {
            var $cancelButton = $("<button type=\"button\" class=\"btn btn-danger js-cancel-appt\">Cancel</button>");
            $cancelButton.attr({"data-visit-id": response.id});

            $tr.append($("<td></td>").append($cancelButton));
        }
    }

    function _scheduleVisit(request) {
        var payload = JSON.stringify(request);

        var options = {
            type: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            url: "visits",
            data: payload
        };

        return $.ajax(options);
    }



    function _datePicker(event) {
        console.log(event);
        $('#datePicker').datepicker({
            format: 'yyyy-mm-dd',
            setDate: new Date(),
            autoclose : true
        });
    }

    function _timePicker(event) {
        $('#timePicker').timepicker({
            zindex: 9999999,
            timeFormat: 'h:mm p',
            interval: 60,
            minTime: '8:00am',
            maxTime: '5:00pm',
            dynamic: false,
            dropdown: true,
            scrollbar: true

        });
    }

    function _fetchAllPets() {
        var options;

        options = {
            type: "GET",
            headers: {
                "Accept": "application/json"
            },
            url: "pets"
        };

        return $.ajax(options);
    }

    function _fetchAllVets() {
        var options;

        options = {
            type: "GET",
            headers: {
                "Accept": "application/json"
            },
            url: "vets"
        };

        return $.ajax(options);
    }

    function _fetchAllVisits() {
        var options;

        options = {
            type: "GET",
            headers: {
                "Accept": "application/json"
            },
            url: "visits"
        };

        return $.ajax(options);
    }

    function _addVet(event) {
        var firstName = $("#vetFirstName").val();
        var lastName = $("#vetLastName").val();

        var requestBody = {};
        requestBody['firstName'] = firstName;
        requestBody['lastName'] = lastName;
        // TODO: get the specialties from the dropdown.
        requestBody['specialties'] = ["radiology"];


        $.when(_createVet(requestBody)).done(_onCompleteNewVet);
    }

    function _createVet(body) {
        var options;
        var typed = {};
        typed['vet'] = body;

        var payload = JSON.stringify(body);
        options = {
            type: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            url: "vets",
            data: payload
        };

        return $.ajax(options);
    }

    function _onCompleteNewVet(response) {
        window.console.log(response);
    }

    function _individualVetClicked(event) {
        window.console.log(event);

        var today = moment();
        var $target = $(event.target);
        var vetId = $target.attr("data-vet-id");

        var $vetDetailsModal = $("#vetDetailsModal");
        var $addAppointmentButton = $("#addAppointmentButton");
        $addAppointmentButton.attr({"data-vet-id": vetId});

        var $vetApptsTableBody = $("#vetApptsTableBody");
        $vetApptsTableBody.empty();

        var $modalVetName = $("#modalVetName");
        $modalVetName.text(vetsCache[vetId].firstName + " " + vetsCache[vetId].lastName);

        var appointments = visitsCache[vetId];

        if(appointments !== undefined && appointments !== null) {
            for(var i = 0; i < appointments.length; i++) {
                var visitId = appointments[i].id;
                var petId = appointments[i].petId;
                var vetId = appointments[i].vetId;
                var petName = petsCache[appointments[i].petId].name;
                var apptDate = appointments[i].visitDate;
                var description = appointments[i].description;
                var momentApptDate = moment(apptDate);

                var $tr = $("<tr></tr>");
                $tr.attr({"data-visit-id": visitId, "data-pet-id": petId});
                $tr.append($("<td></td>").text(apptDate));
                $tr.append($("<td></td>").text("10:00am"));
                $tr.append($("<td></td>").text(petName));
                $tr.append($("<td></td>").text(description));

                if(momentApptDate.isBefore(today)) {
                    $tr.append($("<td></td>"));
                } else {
                    var $cancelButton = $("<button type=\"button\" class=\"btn btn-danger js-cancel-appt\">Cancel</button>");
                    $cancelButton.attr({"data-visit-id": visitId});

                    $tr.append($("<td></td>").append($cancelButton));
                }

                $vetApptsTableBody.append($tr);
            }
        }

        $vetDetailsModal.modal('show');
    }

    SELECTORS = {
        vets: "#vets",
        addVetButton: "#addVetButton"
    };

    petClinic.initComponent(SELECTORS, _onDomReady);

})(window, window.jQuery, window.doT, window.moment, window.petClinic);
