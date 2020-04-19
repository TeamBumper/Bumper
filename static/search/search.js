if(localStorage.getItem("email") == null || localStorage.getItem("access_token") == null){
	if(localStorage.getItem("email") != null)
		localStorage.removeItem("email");
	else if(localStorage.getItem("access_token") != null)
		localStorage.removeItem("access_token");
	location.href = "/"
}

let lat;
let long;
let zip;
let minPrice;
let maxPrice;
fillYears();
getLocation();
function getLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        setCoordinates(lat,long);
        if (lat != undefined && long != undefined) {
            getZipForLocation(lat, long);
        }
    });
}

function setCoordinates(x,y) {
    lat = x;
    long = y;
}

// Convert lat/long (x,y) to zip (stored in zip)
function getZipForLocation(x,y) {
    fetch(`https://api.geonames.org/findNearbyPostalCodesJSON?lat=${x}&lng=${y}&username=bumperapp`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            try {
                zip = data['postalCodes'][0]['postalCode'];
                document.getElementById('advanced-location').value = zip;
            } catch (e) {
                zip = "";
            }
        });
}

let prev = document.getElementById('noMakeListed');
let make = "";
function changeModel(carMake) {
    make = carMake;
    prev.style.display = 'none';
    var cont = document.getElementById(carMake);
    cont.style.display = 'block';
    prev = cont;
}
let prevAdv = document.getElementById('noMakeListed-adv');
let makeAdv = "";
function changeModelAdv(carMake) {
    makeAdv = carMake;
    prevAdv.style.display = 'none';
    var cont = document.getElementById(carMake+"-adv");
    cont.style.display = 'block';
    prevAdv = cont;  
}

function submitBasic() {
    var selector = document.getElementById('select-basic-' + make);
    model = "";
    if (selector) {
        model = (selector.value).replace(/\s/g, "");
    }

    // Submit new post request to home
    var form = document.getElementById('invisible-submittable');

    var makeAttr = document.createElement('input');
    makeAttr.setAttribute('type', 'text');
    makeAttr.setAttribute('name', 'make');
    makeAttr.setAttribute('value', make);
    form.appendChild(makeAttr);

    var modelAttr = document.createElement('input');
    modelAttr.setAttribute('type', 'text');
    modelAttr.setAttribute('name', 'model');
    modelAttr.setAttribute('value', model);
    form.appendChild(modelAttr);

    var zipEl = document.createElement('input');
    zipEl.setAttribute('type','text');
    zipEl.setAttribute('name', 'zip');
    zipEl.setAttribute('value', zip);
    form.appendChild(zipEl);

    var radius = document.createElement('input');
    radius.setAttribute('type','text');
    radius.setAttribute('name','radius');
    radius.setAttribute('value', 10);
    form.appendChild(radius);

    form.submit();
}

function submitAdvanced() {
    var selector = document.getElementById('select-advanced-' + makeAdv);
    model = "";
    if (selector) {
        model = (selector.value).replace(/\s/g, "");
    }

    var thisZip = document.getElementById('advanced-location').value; 
    if (thisZip.length!=5) {
        alert("Invalid ZIP code");
        return;
    } 

    var minYear = document.getElementById('minYear').value;
    var maxYear = document.getElementById('maxYear').value;
    if (minYear == 'All Years') minYear = 1981;
    if (maxYear == 'All Years') maxYear = 2022;
    var yearString = "";

    if (minYear != "" && maxYear != "") { // min and max set
        minYear = parseInt(minYear);
        maxYear = parseInt(maxYear);
    } else if (minYear == "" && maxYear != "") { // max set, min not set
        minYear = 1981;
        maxYear = parseInt(maxYear);
    } else { // min set, max not set
        minYear = parseInt(minYear);
        maxYear = 2022;
    }
    for(i=minYear; i<=maxYear; i++) {
        yearString += i;        
        yearString += (i == maxYear) ?'' :',';
    }    

    var setRadius = document.getElementById('radius').value;
    try {
        setRadius = parseInt(setRadius);
    } catch (e) {
        setRadius = 10;
    }
    
    // Submit new post request to home
    var form = document.getElementById('invisible-submittable');
    
    
    var makeAttr = document.createElement('input');
    makeAttr.setAttribute('type', 'text');
    makeAttr.setAttribute('name', 'make');
    makeAttr.setAttribute('value', makeAdv);
    form.appendChild(makeAttr);
    
    var modelAttr = document.createElement('input');
    modelAttr.setAttribute('type', 'text');
    modelAttr.setAttribute('name', 'model');
    modelAttr.setAttribute('value', model);
    form.appendChild(modelAttr);
    
    var zipEl = document.createElement('input');
    zipEl.setAttribute('type','text');
    zipEl.setAttribute('name', 'zip');
    zipEl.setAttribute('value', document.getElementById('advanced-location').value);
    zipEl.attributes.required = "required";
    form.appendChild(zipEl);
    
    var radius = document.createElement('input');
    radius.setAttribute('type','text');
    radius.setAttribute('name','radius');
    radius.setAttribute('value', 10);
    form.appendChild(radius);
    
    var years = document.createElement('input');
    years.setAttribute('type', 'text');
    years.setAttribute('name', 'year');
    years.setAttribute('value', yearString)
    form.appendChild(years);
    
    var maxPrice = document.getElementById('maxPrice').value;
    var minPrice = document.getElementById('minPrice').value;
    var price = document.createElement('input');
    price.setAttribute('type', 'text');
    price.setAttribute('name', 'price_range');
    price.setAttribute('value', minPrice + '-' + maxPrice);
    form.appendChild(price);

    form.submit();
}

function fillYears() {
    var minYear = document.getElementById("minYear");
    var maxYear = document.getElementById("maxYear");
    for (var i = 2022; i >= 1981; i--) {
        var element = document.createElement("option");
        element.textContent = i;
        element.value = i;
        maxYear.appendChild(element.cloneNode(true));
        minYear.appendChild(element);
    }
}

(function ($) {
    'use strict';
    /*==================================================================
        [ Daterangepicker ]*/
    
    
    try {
        $('#input-start').daterangepicker({
            ranges: true,
            autoApply: true,
            applyButtonClasses: false,
            autoUpdateInput: false
        },function (start, end) {
            $('#input-start').val(start.format('MM/DD/YYYY'));
            $('#input-end').val(end.format('MM/DD/YYYY'));
        });
    
        $('#input-start-2').daterangepicker({
            ranges: true,
            autoApply: true,
            applyButtonClasses: false,
            autoUpdateInput: false
        },function (start, end) {
            $('#input-start-2').val(start.format('MM/DD/YYYY'));
            $('#input-end-2').val(end.format('MM/DD/YYYY'));
        });
    
    } catch(er) {console.log(er);}
    /*==================================================================
        [ Single Datepicker ]*/
    
    
    try {
        var singleDate = $('.js-single-datepicker');
    
        singleDate.each(function () {
            var that = $(this);
            var dropdownParent = '#dropdown-datepicker' + that.data('drop');
    
            that.daterangepicker({
                "singleDatePicker": true,
                "showDropdowns": true,
                "autoUpdateInput": true,
                "parentEl": dropdownParent,
                "opens": 'left',
                "locale": {
                    "format": 'MM/DD/YYYY'
                }
            });
        });
    
    } catch(er) {console.log(er);}
    /*==================================================================
        [ Special Select ]*/
    
    try {
        var body = $('body,html');
    
        var selectSpecial = $('#js-select-special');
        var info = selectSpecial.find('#info');
        var dropdownSelect = selectSpecial.parent().find('.dropdown-select');
        var listRoom = dropdownSelect.find('.list-room');
        var btnAddRoom = $('#btn-add-room');
        var totalRoom = 1;
    
        selectSpecial.on('click', function (e) {
            e.stopPropagation();
            $(this).toggleClass("open");
            dropdownSelect.toggleClass("show");
        });
    
        dropdownSelect.on('click', function (e) {
            e.stopPropagation();
        });
    
        body.on('click', function () {
            selectSpecial.removeClass("open");
            dropdownSelect.removeClass("show");
        });
    
    
        listRoom.on('click', '.plus', function () {
            var that = $(this);
            var qtyContainer = that.parent();
            var qtyInput = qtyContainer.find('input[type=number]');
            var oldValue = parseInt(qtyInput.val());
            var newVal = oldValue + 1;
            qtyInput.val(newVal);
    
            updateRoom();
        });
    
        listRoom.on('click', '.minus', function () {
            var that = $(this);
            var qtyContainer = that.parent();
            var qtyInput = qtyContainer.find('input[type=number]');
            var min = qtyInput.attr('min');
    
            var oldValue = parseInt(qtyInput.val());
            if (oldValue <= min) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue - 1;
            }
            qtyInput.val(newVal);
    
            updateRoom();
        });
    
    
    
        listRoom.on('change', '.inputQty', function () {
            var that = $(this);
            if (isNumber(that.val())) {
                var qtyVal = parseInt(that.val());
                if (that.val().length === 0) {
                    qtyVal = 0;
                }
    
                if (qtyVal < 0) {
                    qtyVal = 0;
                }
                that.val(qtyVal);
    
                updateRoom();
            }
        });
    
        function isNumber(n){
            return typeof(n) != "boolean" && !isNaN(n);
        }
    
        btnAddRoom.on('click', function (e) {
            e.preventDefault();
    
            totalRoom++;
    
            listRoom.append('<li class="list-room__item">' +
                '                                        <span class="list-room__name"> Room '+ totalRoom +'</span>' +
                '                                        <ul class="list-person">' +
                '                                            <li class="list-person__item">' +
                '                                                <span class="name">' +
                '                                                    Adults' +
                '                                                </span>' +
                '                                                <div class="quantity quantity1">' +
                '                                                    <span class="minus">' +
                '                                                        -' +
                '                                                    </span>' +
                '                                                    <input type="number" min="0" value="0" class="inputQty">' +
                '                                                    <span class="plus">' +
                '                                                        +' +
                '                                                    </span>' +
                '                                                </div>' +
                '                                            </li>' +
                '                                            <li class="list-person__item">' +
                '                                                <span class="name">' +
                '                                                    Children' +
                '                                                </span>' +
                '                                                <div class="quantity quantity2">' +
                '                                                    <span class="minus">' +
                '                                                        -' +
                '                                                    </span>' +
                '                                                    <input type="number" min="0" value="0" class="inputQty">' +
                '                                                    <span class="plus">' +
                '                                                        +' +
                '                                                    </span>' +
                '                                                </div>' +
                '                                            </li>' +
                '                                        </ul>');
    
    
            updateRoom();
        });
    
    
        function countAdult() {
            var listRoomItem = listRoom.find('.list-room__item');
            var totalAdults = 0;
    
            listRoomItem.each(function () {
                var that = $(this);
                var numberAdults = parseInt(that.find('.quantity1 > input').val());
    
                totalAdults = totalAdults + numberAdults;
    
            });
    
            return totalAdults;
        }
    
        function countChildren() {
            var listRoomItem = listRoom.find('.list-room__item');
            var totalChildren = 0;
    
            listRoomItem.each(function () {
                var that = $(this);
                var numberChildren = parseInt(that.find('.quantity2 > input').val());
    
                totalChildren = totalChildren + numberChildren;
            });
    
            return totalChildren;
        }
    
        function updateRoom() {
            var totalAd = parseInt(countAdult());
            var totalChi = parseInt(countChildren());
            var adults = 'Adult, ';
            var rooms = 'Room';
    
            if (totalAd > 1) {
                adults = 'Adults, ';
            }
    
            if (totalRoom > 1) {
                rooms = 'Rooms';
            }
    
            var infoText = totalAd + ' ' + adults + totalChi + ' ' + 'Children, ' + totalRoom + ' ' + rooms;
    
            info.val(infoText);
        }
    
    } catch (e) {
        console.log(e);
    }
    /*[ Select 2 Config ]
        ===========================================================*/
    
    try {
        var selectSimple = $('.js-select-simple');
    
        selectSimple.each(function () {
            var that = $(this);
            var selectBox = that.find('select');
            var selectDropdown = that.find('.select-dropdown');
            selectBox.select2({
                dropdownParent: selectDropdown
            });
        });
    
    } catch (err) {
        console.log(err);
    }
    

})(jQuery);