jQuery(function ($) {
    $(document).delegate("#basic_load input[type='number']", 'change', function(){
            var curPlaceholderVal = $(this).attr('placeholder');
            var allSqmAndSqft = document.querySelectorAll("#basic_load input[type='number']");
            if ($(this).val() != ''){
                for (var i = 0; i < allSqmAndSqft.length; i++) {
                    if (allSqmAndSqft[i].placeholder != curPlaceholderVal) {
                        allSqmAndSqft[i].readonly = 'readonly';
                        allSqmAndSqft[i].disabled = 'disabled';
                        allSqmAndSqft[i].style.border = "";
                    }
                    if (allSqmAndSqft[i].value != "") {
                        allSqmAndSqft[i].style.border = "";
                    }
                }
            }else{
                    var allEmpty = true;
                    for(var i= 0;i<allSqmAndSqft.length;i++){
                if (allSqmAndSqft[i].value != "") {
                    allEmpty = false
                }
            }
            if (allEmpty) {
                for (var i = 0; i < allSqmAndSqft.length; i++) {
                    allSqmAndSqft[i].readonly = '';
                    allSqmAndSqft[i].disabled = '';
                }
            }
        }
    });

    $("#basic_load input[type='checkbox']").change(function () {
        if (!$(this).is(':checked')){
            var clearInputs = $(this).siblings("input[type='number']").val('').change();
        }
    });

    $(".description_wrap").mouseenter(function () {
        $(this).closest('div').find('.description:first').show()
    });

    $(".description_wrap").mouseleave(function () {
        $(this).closest('div').find('.description:first').hide();
    });

    $("#calculation_form input[type='checkbox']").change(function () {
        if ($(this).is(':checked')){
            $(this).siblings("input[type='number'], .or").show();
        } else {
            $(this).siblings("input[type='number'], .or").hide();
        }
    });

    var validate = function () {
        var valid = true;

        var intAndFloat = /^\d+((\.|\,)\d+)?$/;
        var allInputs = $("#calculation_form input[type='number']");
        for (var i = 0; i < allInputs.length; i++) {
            if ((allInputs[i].style.display != "none" && !allInputs[i].disabled && allInputs[i].value == "") || allInputs[i].value == "0") {
                allInputs[i].style.border = "2px solid red";
                valid = false;
            } else {
                allInputs[i].style.border = "";
            }
        }
        return valid
    }

    $("#calculate_button").click(function (event) {
        event.preventDefault();
        if (validate()) {
            calculate();
        }

    });

    //floor size without basement
    var floorSize = '';
  
    var calculate = function () {
        $(".report .body,.report .head,.report .foot").text('');
        $(".report .head").append('Service size report');

        var mainFloor = 0;
        var basement_finished = 0;
        var basement_unfinished = 0;

        mainFloor = $(".main_floor input[type='number']:enabled");
        if (mainFloor[0].getAttribute('placeholder') == "sqft"){
            mainFloor = Number((parseFloat(mainFloor.val()) / 10.764).toFixed(3));
        }else{
            mainFloor = parseFloat(mainFloor.val());
        }
        if ($(".basement_finished input[name='basement_finished']:checked").length != 0) {
            basement_finished = $(".basement_finished input[type='number']:enabled");
            if (basement_finished[0].getAttribute('placeholder') == "sqft"){
                basement_finished = Number((parseFloat(basement_finished.val()) / 10.764).toFixed(3));
            } else {
                basement_finished = parseFloat(basement_finished.val());
            }
        }
        if ($(".basement_unfinished input[name='basement_unfinished']:checked").length != 0) {
            basement_unfinished = $(".basement_unfinished input[type='number']:enabled");
            if (basement_unfinished[0].getAttribute('placeholder') == "sqft"){
                basement_unfinished = Number((parseFloat(basement_unfinished.val()) / 10.764).toFixed(3));
            } else {
                basement_unfinished = parseFloat(basement_unfinished.val());
            }
        } 
        floorSize = parseFloat(mainFloor);

        floorArea = mainFloor + basement_finished + basement_unfinished * 0.75;

        var summwatts = '';
        var fullwatts = '';
        var tailwatts = '';
        //-- step 1

        fullwatts = floorArea / 90;
        tailwatts = fullwatts % 1;
        fullwatts = Math.floor(fullwatts);

        if (tailwatts >= 0.111) {
            fullwatts = fullwatts + 1;
        }
        summwatts = 5000;

        for (var i = 1; i < fullwatts; i++) {
            floorArea = floorArea - 90;
            summwatts = summwatts + 1000
        }
        $(".report .body").append('<p>'+addDots('Floor Area')+summwatts+'watts</p>');

        //---
        //--appliances

        //first range
        if($("#appliances input[name='range']:checked").length != 0) {
            var firstRange = 6000;
            if ($("#appliances input[name='range_input']").val() > 12000) {
                firstRange = firstRange + (parseFloat($("#appliances input[name='range_input']").val() - 12000) * 0.4);
            }
            summwatts = summwatts + firstRange;
            $(".report .body").append('<p>'+addDots('First range')+firstRange+'watts</p>');
        }
        //2nd range
        if ($("#appliances input[name='2nd_range']:checked").length != 0) {
            var secoundRange = parseFloat($("#appliances input[name='2nd_range_input']").val() * 0.25);
            summwatts = summwatts + secoundRange;
            $(".report .body").append('<p>'+addDots('2nd Range')+secoundRange+'watts</p>');
        }
        //dryer
        if ($("#appliances input[name='dryer']:checked").length != 0) {
            var dryer = parseFloat($("#appliances input[name='dryer_input']").val()) * 0.25;
            summwatts = summwatts + dryer;
            $(".report .body").append('<p>'+addDots('Dryer')+dryer+'watts</p>');
        }
        //water heater
        if ($("#appliances input[name='water_heater']:checked").length != 0) {
            var waterHeater = parseFloat($("#appliances input[name='water_heater_input']").val()) * 0.25;
            summwatts = summwatts + waterHeater;
            $(".report .body").append('<p>'+addDots('Water Heater')+waterHeater+'watts</p>');
        }
        //tankless water heater
        if ($("#appliances input[name='tankless_water_heater']:checked").length != 0) {
            var tanklessWaterHeater = parseFloat($("#appliances input[name='tankless_water_heater_input']").val());
            summwatts = summwatts + tanklessWaterHeater;
            $(".report .body").append('<p>'+addDots('Tankless water heater')+tanklessWaterHeater+'watts</p>');
        }
        var sauna = $("#additional_appliances input[name='sauna']:checked").length,
        sauna_input = parseFloat($("#additional_appliances input[name='sauna_input']").val()),
        baseboard_heating = $("#additional_appliances input[name='baseboard_heating']:checked").length,
        baseboard_heating_input = parseFloat($("#additional_appliances input[name='baseboard_heating_input']").val()),
        air_furnace = $("#additional_appliances input[name='air_furnace']:checked").length,
        air_furnace_input = parseFloat($("#additional_appliances input[name='air_furnace_input']").val()),
        air_conditioning = $("#additional_appliances input[name='air_conditioning']:checked").length,
        air_conditioning_input = parseFloat($("#additional_appliances input[name='air_conditioning_input']").val()),
        heavy_appliances = $("#heavy_appliances input[name='heavy_appliances']:checked").length,
        heavy_appliances_input = parseFloat($("#heavy_appliances input[name='heavy_appliances_input']").val());

    //Sauna
    if (sauna != 0 && baseboard_heating == 0 && air_furnace == 0) {
        var sauna = sauna_input;
        summwatts = summwatts + sauna;
        $(".report .body").append('<p>'+addDots('Sauna')+sauna+'watts</p>');
    }
    //Baseboard heating 
    if (baseboard_heating != 0 && sauna == 0) {
        var baseboardHeating = baseboard_heating_input;
        summwatts = summwatts + baseboardHeating;
        $(".report .body").append('<p>'+addDots('Baseboard heating')+baseboardHeating+'watts</p>');
    }
    //Baseboard heating and Sauna
    if (sauna != 0 && baseboard_heating != 0) {
        var sauna_ = sauna_input;
        var heating = baseboard_heating_input;
        var heatingAndSaunaSum = sauna_ + heating;
        var heatingAndSauna = heatingAndSaunaSum;


        if (heatingAndSaunaSum > 10000) {
            var balance = heatingAndSaunaSum - 10000
            heatingAndSauna = summwatts + 10000 + ((balance * 75) / 100);
        }
        summwatts = summwatts + heatingAndSauna;
        $(".report .body").append('<p>'+addDots('Baseboard heating and Sauna')+heatingAndSauna+'watts</p>');
    }
    //Air Furnace
    if ((air_furnace != 0 && sauna == 0) || (air_furnace != 0 && baseboard_heating != 0 && sauna != 0)) {
        var airFurnace = air_furnace_input
        summwatts = summwatts + airFurnace;
        $(".report .body").append('<p>'+addDots('Air Furnace')+airFurnace+'watts</p>');
    }
    //Air Furnace and Sauna
    if (sauna != 0 && air_furnace != 0 && baseboard_heating == 0) {
        var sauna_ = sauna_input;
        var furnace = air_furnace_input;
        var furnaceAndSauna = furnace + ((sauna_ * 75) / 100);
        summwatts = summwatts + furnaceAndSauna;
        $(".report .body").append('<p>'+addDots('Air Furnace and Sauna')+furnaceAndSauna+'watts</p>');
    }
    //Air Conditioning
    if (air_conditioning != 0) {
        var airConditioning = air_conditioning_input;
        summwatts = summwatts + airConditioning;
        $(".report .body").append('<p>'+addDots('Air Conditioning')+airConditioning+'watts</p>');
    }
    //Heavy Appliances
    if (heavy_appliances != 0) {
        var heavyAppliances = heavy_appliances_input;
        summwatts = summwatts + heavyAppliances;
        $(".report .body").append('<p>'+addDots('Heavy Appliances')+heavyAppliances+'watts</p>');
    }
    var serviceSize = '';

    $(".report .body").append('<p>Total watts: <b>'+summwatts+'watts</b></p>');
    $(".report .body").append('<p>Total amps: <b>'+(summwatts/240).toFixed(3)+'amps</b></p>'); 
      
    if(sauna == 0 && baseboard_heating == 0 && air_furnace == 0 && air_conditioning == 0 && heavy_appliances == 0) {
        if (floorSize < 80) {

            $(".report .body").append('<p>Your floor area is less then 80sqm (861sqft)</p>');

        serviceSize = 60;
        } else {
            $(".report .body").append('<p>Your floor area is 80smq (861sqft) or more</p>');
            serviceSize = 100;
        }
    } else {
        serviceSize = (summwatts / 240).toFixed(1);
        if (serviceSize <= 60 && floorSize < 80) {
            serviceSize = 60;
            $(".report .body").append('<p>Your floor area is less then 80sqm (861sqft) </p>');
        }else if (serviceSize <= 100 && floorSize >= 80) {
            serviceSize = 100;
            $(".report .body").append('<p>Your floor area is 80sqm (861sqft) or more</p>');
        }
    }

    // $(".result").text('Minumum service size required ' + serviceSize + 'amps');
    $(".report .foot").append('<p>Considering the given calculations and floor area,<br> your minumum service size required: <b>' + serviceSize + 'amps</b>.</p>');
    };

    var addDots = function (text) {
        var text = text;
        var cutTextTo = 30;
        if (text.length >= cutTextTo || cutTextTo - text.length < 3) {
            text = text.substr(0, cutTextTo - 3)
        }
        if (text.length < cutTextTo) {
            while (text.length < cutTextTo) {
                text = text + '.';
            }
        }
        return text;
    };

    $("#print_button").click(function (event) {
        event.preventDefault();
        printVer();
    });
    var printVer = function () {
        var data = $(".report").html();
        myWindow = window.open("data:text/html," + encodeURIComponent(data), "_blank");
    };
    $('#send_report').click(function() {
        $.ajax({
            type: "POST",
            data: {
            'action': 'send_email'}
            }).done(function (msg) {
            console.log("Data Saved: " + msg);
        }).fail(function () {
            alert("error");
        });   
    });

    //bulbs calc
    $(document).delegate("#bulbsCalc input[type='number']", 'change', function(){
        if($(this).val() != ''){
            $(this).css('border','');
        }
    });

    $(".description_bulb_wrap").mouseenter(function () {
        $(this).siblings('div').show()
    });

    $(".description_bulb_wrap").mouseleave(function () {
        $(this).siblings('div').hide();
    });

    var validate_bulbs = function () {
        var valid = true;
        var intAndFloat = /^\d+((\.|\,)\d+)?$/;
        var allInputs = $("#bulbs_form input[type='number']");
        for (var i = 0; i < allInputs.length; i++) {
            if ((allInputs[i].value == "" || allInputs[i].value == "0" || !intAndFloat.test(allInputs[i].value)) && allInputs[i].required) {
                allInputs[i].style.border = "2px solid red";
                valid = false;
            } else {
                allInputs[i].style.border = "";
            }
        }
        return valid
    }
    $("#bulbs_calc_button").click(function (event) {
        event.preventDefault();
        if (validate_bulbs()) {
            calculate_bulbs();
        }
    });

    $("#add_line").click(function () {
        event.preventDefault();
        var add_line = $('#bulbsCalc tbody tr:last').clone();
        $(add_line).find("input").val("");
        $('#bulbsCalc table tbody').append(add_line);
    });

    $("#remove_line").click(function () {
        event.preventDefault();
        var remove_line = $('#bulbsCalc tbody tr');
        if(remove_line.length > 1) {
            $('#bulbsCalc tbody tr:last').remove();
        }
    });

    var calculate_bulbs = function () {
        var result = 0;
        var sumOfHours = 0;
        var on_peak_const = 17.5; //winter
        var off_peak_const = 8.3; //winter
        var allTr = $('#bulbsCalc tbody tr')
        for(var i = 0; i < allTr.length; i++) {
            var allTd = $(allTr[i]).find('input');
            var quantity = parseFloat($(allTd[0]).val());
            var power = parseFloat($(allTd[1]).val());
            var on_peak = $(allTd[2]).val();
            var off_peak = $(allTd[3]).val();
            if (on_peak == "") { on_peak = 0; }
            if (off_peak == "") { off_peak = 0; }
            on_peak = parseFloat(on_peak);
            off_peak = parseFloat(off_peak);
            sumOfHours = sumOfHours + on_peak + off_peak;
            result = result + ((quantity * power) / 1000) * ((on_peak * on_peak_const) + (off_peak * off_peak_const));
        }
        var aprox_result = (result / 100).toFixed(2);
        if (result / 100 < 0.01 && result != 0) {
            aprox_result = 'less then 0.01';
        }
        $('.bulbs_calc_result').text('Your approximately payment '+aprox_result+"CAD for "+sumOfHours+"h");
    }
});