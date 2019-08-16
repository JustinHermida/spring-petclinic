(function ownersIIFE(window, $, doT, moment, petClinic) {
    "use strict";

    var SELECTORS, ownersCache = {}, petsCache = {}, vetsCache = {};

    function _onDomReady() {
        _buildInitialPage();

        $(SELECTORS.owners).on('click', '.js-add-pet', _addPet);
        $(SELECTORS.owners).on('click', '.js-pet', _petSelected);
        $("#addPetModal").on('click', '#addPetButton', _createPet);
        $("#petVisitsModal").on('click', '.js-cancel-appt', _cancelVisit);
        $("#petVisitsModal").on('click', '#addAppointmentButton', _addVisit);
        $("#petVisitsModal").on('click', '#datePicker', _datePicker);
        $("#petVisitsModal").on('click', '#timePicker', _timePicker);
        $("#petVisitsModal").on('click', '.js-schedule-appt', _scheduleAppt);
    }

    function _buildInitialPage() {
        $.when(_fetchAllOwners()).done(_renderOwnersPage);
    }

    function _renderOwnersPage(owners) {

        var ownersList = owners.owners;
        for(var i = 0; i < ownersList.length; i++) {
            ownersCache[ownersList[i].id] = ownersList[i];

            for(var j = 0; j < ownersList[i].pets.length; j++) {
                petsCache[ownersList[i].pets[j].id] = ownersList[i].pets[j];
            }
        }

        var $ownersTable = petClinic.renderTemplate("ownerTable", {
            ownerList: owners.owners
        });

        $ownersTable.appendTo($(SELECTORS.owners));
    }

    function _scheduleAppt(event) {
        var $target = $(event.target);
        var petId = $target.attr("data-pet-id");
        var $datePicker = $("#datePicker");
        var $timePicker = $("#timePicker");
        var $visitDescription = $("#visitDescription");

        var params = {
            petId: petId,
            vetId: 1, // TODO get real vet id.
            visitDate: $datePicker.val(),
            time: $timePicker.val(),
            description: $visitDescription.val()
        };


        console.log(params);

        $.when(_scheduleVisit(params)).done(_visitComplete);

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

    function _visitComplete(response) {
        console.log(response);

        var visitDate = response.visitDate;
        var today = moment();
        var momentVisitDate = moment(visitDate);

        var $tr = $("#apptsTableBody").find("tr:first");
        $tr.empty();

        $tr.append($("<td></td>").text(visitDate));
        $tr.append($("<td></td>").text("10:00am"));
        $tr.append($("<td></td>").text("James Carter"));
        $tr.append($("<td></td>").text(response.description));

        if(momentVisitDate.isBefore(today)) {
            $tr.append($("<td></td>"));
        } else {
            var $cancelButton = $("<button type=\"button\" class=\"btn btn-danger js-cancel-appt\">Cancel</button>");
            $cancelButton.attr({"data-visit-id": response.id});

            $tr.append($("<td></td>").append($cancelButton));
        }

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

    function _addVisit(event) {
        var $target = $(event.target.parentElement);
        var petId = $target.attr("data-pet-id");
        var $apptTableBody = $("#apptsTableBody");
        var $tr = $("<tr></tr>");

        var $dateInput = $("<input class=\"form-control\" id=\"datePicker\" name=\"date\" placeholder=\"MM-DD-YYY\" type=\"text\"/>");
        var $startTimeInput = $("<input type=\"text\" id=\"timePicker\" class=\"form-control timePicker\" autocomplete=\"off\"/>");
        var $scheduleButton = $("<button type=\"button\" class=\"btn btn-success js-schedule-appt\">Schedule</button>");
        $scheduleButton.attr({"data-pet-id": petId});
        var $descriptionInput = $("<input type=\"text\" id=\"visitDescription\" class=\"form-control\"/>");

        $tr.append($("<td></td>").append($dateInput));
        $tr.append($("<td></td>").append($startTimeInput));
        $tr.append($("<td></td>").text("James Carter"));
        $tr.append($("<td></td>").append($descriptionInput));
        $tr.append($("<td></td>").append($scheduleButton));

        $apptTableBody.prepend($tr);
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
        var $petVisitsModal = $("#petVisitsModal");
        var $visit = $petVisitsModal.find("tr[data-visit-id=" + visitIdDeleted + "]");
        var petId = $visit.attr("data-pet-id");
        var visits = petsCache[petId].visits;

        // remove the visit from the pet cache.
        for(var i = 0; i < visits.length; i++) {
            if ( visits[i].id === visitIdDeleted) {
                visits.splice(i, 1);
                break;
            }
        }

        // remove visit from the modal.
        $visit.remove();
    }

    function _createPet(event) {
        console.log("Creating a pet");

        var $addPetModal = $("#addPetModal");
        var $petName = $("#petName");
        var $birthDate = $("#petBirthDate");
        var $petType = $("#petTypeDropdown").find("input[name='petType']:checked");
        var ownerId = $addPetModal.attr("data-owner-id");
        var ownerName = $addPetModal.attr("data-owner-name");

        console.log(ownerId + " " +
            ownerName + " " +
            $petName.val() + " " +
            $birthDate.val() + " " +
            $petType.val());

        var requestBody = {};
        requestBody['name'] = $petName.val();
        requestBody['birthDate'] = $birthDate.val();
        requestBody['typeId'] = $petType.val();
        requestBody['ownerId'] = ownerId;

        $.when(_postPet(requestBody)).done(_createPetComplete);
    }

    function _postPet(requestBody) {
        var payload = JSON.stringify(requestBody);

        var options = {
            type: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            url: "pets",
            data: payload
        };

        return $.ajax(options);
    }

    function _petSelected(event) {

        var today = moment();
        var $target = $(event.target);
        var ownerId = $target.attr("data-owner-id");
        var petId = $target.attr("data-pet-id");
        var birthDate = $target.attr("data-birth-date");
        var petType = $target.attr("data-pet-type");
        var petName = $target.text();

        var $petVisitsModal = $("#petVisitsModal");
        var $addAppointmentButton = $("#addAppointmentButton");
        var $apptsTableBody = $("#apptsTableBody");
        $apptsTableBody.empty();

        $addAppointmentButton.attr({"data-pet-id" : petId});

        $("#modalPetName").text(petName);
        $("#modalPetBirthDate").text(birthDate);
        $("#modalPetType").text(petType);

        console.log(ownersCache[ownerId]);
        console.log(petsCache[petId]);

        var visits = petsCache[petId].visits;

        if(visits !== undefined && visits !== null) {
            for(var i = 0; i < visits.length; i++) {
                var $tr = $("<tr></tr>").attr({"data-visit-id" : visits[i].id, "data-pet-id" : petId});
                var visitDate = visits[i].visitDate;
                var momentVisitDate = moment(visitDate);
                $tr.append($("<td></td>").text(visitDate));
                $tr.append($("<td></td>").text("10:00am"));
                $tr.append($("<td></td>").text("Linda Douglas"));
                $tr.append($("<td></td>").text(visits[i].description));

                if(momentVisitDate.isBefore(today)) {
                    $tr.append($("<td></td>"));
                } else {
                    var $cancelButton = $("<button type=\"button\" class=\"btn btn-danger js-cancel-appt\">Cancel</button>");
                    $cancelButton.attr({"data-visit-id": visits[i].id});

                    $tr.append($("<td></td>").append($cancelButton));
                }

                $apptsTableBody.append($tr);
            }
        }

        $petVisitsModal.modal('show');
    }

    function _createPetComplete(data) {
        console.log("Create Pet complete!");

        $(SELECTORS.owners).empty();

        _buildInitialPage();

        var $addPetModal = $("#addPetModal");
        $addPetModal.modal('hide');
    }

    function _addPet(event) {
        console.log(event.target);

        var $addPetModal = $("#addPetModal");
        var $addPetTitle = $("#addPetTitle");
        var $ownerRow = $(event.target.parentElement.parentElement.parentElement);
        var id = $ownerRow.find("td:eq(0)").text();
        var ownerName = $ownerRow.find("td:eq(1) > a").text();

        $("#petName").val("");
        $("#petBirthDate").val("");

        $addPetModal.attr({"data-owner-id": id, "data-owner-name": ownerName});
        $addPetTitle.text("Add a pet for " + ownerName);

        $addPetModal.modal('show');
    }

    function _fetchAllOwners() {
        var options;

        options = {
            type: "GET",
            headers: {
                "Accept": "application/json"
            },
            url: "owners"
        };

        return $.ajax(options);
    }

    SELECTORS = {
        owners: "#owners"
    };

    petClinic.initComponent(SELECTORS, _onDomReady);

})(window, window.jQuery, window.doT, window.moment, window.petClinic);
