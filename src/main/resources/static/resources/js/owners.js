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
        $("#petModalCloseButton").on('click', _buildInitialPage);
    }

    function _buildInitialPage() {
        $(SELECTORS.owners).empty();

        $.when(_fetchAllOwners()).done(_renderOwnersPage);
        $.when(_fetchAllVets()).done(_saveVetsToCache)
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

    function _saveVetsToCache(response) {
        var vets = response.vets;
        for(var i = 0; i < vets.length; i++) {
            vetsCache[vets[i].id] = vets[i];
        }
        console.log(vetsCache);
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
        var vetId = $("#vetList").find("input:checked").val();

        var params = {
            petId: petId,
            vetId: vetId,
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
            data: payload,
            error: function () {
                alert("Scheduling conflict detected! Please select a different time.");
            }
        };

        return $.ajax(options);
    }

    function _visitComplete(response) {
        console.log(response);

        var visitDate = response.visitDate;
        var time = response.time;
        var vetId = response.vetId;
        var petId = response.petId;
        var vetName = vetsCache[vetId].firstName + " " + vetsCache[vetId].lastName;

        var today = moment();
        var momentVisitDate = moment(visitDate);

        var $tr = $("#apptsTableBody").find("tr:first");
        $tr.attr({"data-pet-id": petId, "data-vet-id": vetId, "data-time": time, "data-date": visitDate});
        $tr.empty();

        $tr.append($("<td></td>").text(visitDate));
        $tr.append($("<td></td>").text(time));
        $tr.append($("<td></td>").text(vetName));
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
            daysOfWeekDisabled: [0,6],
            startDate: new Date(),
            autoclose : true
        });
    }

    function _timePicker(event) {
        $('#timePicker').timepicker({
            zindex: 9999999,
            timeFormat: 'h:mm p',
            interval: 60,
            minTime: '8:00am',
            maxTime: '4:00pm',
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

        var $dateInput = $("<input class=\"form-control\" id=\"datePicker\" name=\"date\" placeholder=\"YYYY-MM-DD\" type=\"text\"/>");
        var $startTimeInput = $("<input type=\"text\" id=\"timePicker\" class=\"form-control timePicker\" autocomplete=\"off\"/>");
        var $scheduleButton = $("<button type=\"button\" class=\"btn btn-success js-schedule-appt\">Schedule</button>");
        $scheduleButton.attr({"data-pet-id": petId});
        var $descriptionInput = $("<input type=\"text\" id=\"visitDescription\" class=\"form-control\"/>");

        var $divDropDown = $("<div class=\"dropdown\">");
        var $vetDropDownMenuButton = $("<button class=\"btn btn-secondary dropdown-toggle\" " +
            "type=\"button\" id=\"vetDropDownMenuButton\" " +
            "data-toggle=\"dropdown\" " +
            "aria-haspopup=\"true\" " +
            "aria-expanded=\"false\"></button>");
        $vetDropDownMenuButton.text("Choose Vet");

        $divDropDown.append($vetDropDownMenuButton);

        var $ulVetsList = $("<ul id=\"vetList\" class=\"dropdown-menu\"></ul>");

        for(var vetId in vetsCache) {
            if(vetsCache.hasOwnProperty(vetId)) {
                var $li = $("<li></li>");
                var $label = $("<label></label>");
                var $input = $("<input type=\"radio\" name=\"vetName\" value=\"" + vetsCache[vetId].id + "\"/>");

                $label.append($input);
                $label.append("&nbsp;" + vetsCache[vetId].firstName + "&nbsp;" + vetsCache[vetId].lastName);

                $li.append($label);

                $ulVetsList.append($li);
            }
        }

        $divDropDown.append($ulVetsList);

        $tr.append($("<td></td>").append($dateInput));
        $tr.append($("<td></td>").append($startTimeInput));
        $tr.append($("<td></td>").append($divDropDown));
        $tr.append($("<td></td>").append($descriptionInput));
        $tr.append($("<td></td>").append($scheduleButton));

        $apptTableBody.prepend($tr);
    }

    function _cancelVisit(event) {
        var $target = $(event.target);
        var $parentTr = $target.closest('tr');
        var vetId = $parentTr.attr("data-vet-id");
        var apptDate = $parentTr.attr("data-date");
        var time = $parentTr.attr("data-time");

        var params = {
            visitDate: apptDate,
            vetId: vetId,
            time: time
        };

        $.when(_cancelAppointment(params).done(_removeVisitFromModal));
    }

    function _cancelAppointment(request) {
        var payload = JSON.stringify(request);

        var options = {
            type: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            data: payload,
            url: "visits"
        };

        return $.ajax(options);
    }

    function _removeVisitFromModal(response) {
        var vetId = response.vetId;
        var visitDate = response.visitDate;
        var time = response.time;

        var $petVisitsModal = $("#petVisitsModal");
        var $visit = $petVisitsModal.find("tr[data-vet-id=" + vetId + "]" +
            "[data-date='" + visitDate + "']" +
            "[data-time='" + time + "']");
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
                var visitDate = visits[i].visitDate;
                var petId = visits[i].petId;
                var apptDate = visits[i].visitDate;
                var time = visits[i].time;
                var vetId = visits[i].vetId;
                var vet = vetsCache[vetId];
                var vetName = vet.firstName + " " + vet.lastName;
                var momentVisitDate = moment(visitDate);

                var $tr = $("<tr></tr>").attr({"data-pet-id": petId, "data-vet-id": vetId, "data-time": time, "data-date": apptDate});
                $tr.append($("<td></td>").text(visitDate));
                $tr.append($("<td></td>").text(time));
                $tr.append($("<td></td>").text(vetName));
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
