var categoryList = new Map([["None", "transparent"], ["Friends", "pink"], ["School", "#60c1f0"], ["Holiday", "#b8b8ea"], ["Other", "green"]]);
let categoriesFiltered = new Map(categoryList);

var events = [{name: "Movie", date: "May 29 2024", startTime: "14:30", endTime: "16:00", details: "At AMC", category: "Friends"}, {name: "Math Class", date: "May 30 2024", startTime: "8:30", endTime: "10:00", details: "test today", category: "School"}, {name: "Class", date: "May 7 2024", startTime: "12:30", endTime: "13:30", details: "", category: "School"}, {name: "Star Wars Day", date: "May 4 2024", startTime: "14:30", endTime: "16:00", details: "", category: "Other"}];

let date = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let month = monthNames[date.getMonth()];
let day = new Date().getDate();
let year = date.getFullYear();
let lengthOfMonth;

// display Calendar on page
function displayCalendar() {
    let firstDayOfMonth = new Date(`${month} 1 ${year}`);
    firstDayOfMonth = firstDayOfMonth.getDay();

    // figure out number of days in current month
    switch (date.getMonth()) {
        case 8:
        case 3:
        case 5:
        case 10:
            lengthOfMonth = 30;
            break;
        case 1:
            // if its February, determine if its a leap year
            if (year % 400 == 0)
                lengthOfMonth = 29;
            else if (year % 4 == 0 && year % 100 != 0)
                lengthOfMonth = 29;
            else
                lengthOfMonth = 28;
            break;
        default:
            lengthOfMonth = 31;
            break;
    }

    let calendarDateHTML = `<table class="table col-12"><tr><th>${dayNames[0]}</th><th>${dayNames[1]}</th><th>${dayNames[2]}</th><th>${dayNames[3]}</th><th>${dayNames[4]}</th><th>${dayNames[5]}</th><th>${dayNames[6]}</th></tr>`;
    calendarDateHTML += "<tr>";
    
    let dayCount = firstDayOfMonth;

    for (let i = 0; i < lengthOfMonth; i++) {
        if (i == 0) {
            for (let j = 0; j < firstDayOfMonth; j++) {
                calendarDateHTML += "<td></td>";
            }
        }

        if (((i + 1) == day) && (year == new Date().getFullYear()) && (date.getMonth() == new Date().getMonth())) {
            calendarDateHTML += `<td class="today"><h6>${i+1}</h6></td>`;
        } else {
            calendarDateHTML += `<td><h6>${i+1}</h6></td>`;
        }
        dayCount += 1;
        if (dayCount > 6) {
            dayCount = 0;
            calendarDateHTML += "</tr><tr>";
        } else if (i == lengthOfMonth) {
            calendarDateHTML += "</tr>";
        }
    }
    calendarDateHTML += '</table>';
    
    let currentDate = `${month} ${year}`;
    $("#current-date").html(currentDate);
    $(".calendar").html(`${calendarDateHTML}`);

}

// display calendar for month and year chosen with dropdown menu
function getChosenDate() {
    let chosenMonth = $("#month")[0].value;
    let chosenYear = $("#year")[0].value;

    date = new Date(`${chosenMonth} 1 ${chosenYear}`);
    month = chosenMonth;
    year = chosenYear;
    displayCalendar();
    displayHolidays(chosenYear);
    displayEventsInCalendar();

}

function sanitizeInput(val) {
    val = val.trim();
    val = val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
    return val;
}

// triggered when user sumbits for to add event
function addEvent(day) {
    // get values
    let nameVal = sanitizeInput($("#name").val());
    let catVal = $("#category").children("option:selected").val();
    let stVal = $("#start-time").val();
    let etVal = $("#end-time").val();
    let detailVal = sanitizeInput($("#details").val()); 
    let errorMessage = $("#error-message");

    // check name, start time and end time inputs aren't empty
    if (nameVal == "") {
        $("#name").css({"border": "solid rgba(255,0,0,.75) .25em"});
        errorMessage.html("Please give the event a name");
    } else if (stVal == "") {
        $("#name").css({"border": "none"});
        $("#start-time").css({"border": "solid rgba(255,0,0,.75) .25em"});
        errorMessage.html("Please give the event a start time");
    } else if (etVal == "") {
        $("#name").css({"border": "none"});
        $("#start-time").css({"border": "none"});
        $("#end-time").css({"border": "solid rgba(255,0,0,.75) .25em"});
        errorMessage.html("Please give the event a end time");
    } else {
        $("#name").css({"border": "none"});
        $("#start-time").css({"border": "none"});
        $("#end-time").css({"border": "none"});
        // Add new event to events array
        events.push({name: nameVal, date: `${month} ${day} ${year}`, startTime: stVal, endTime: etVal, details: detailVal, category: catVal});
        // get rid of add events form
        $(".add-event").html("");
        localStorage.setItem("events", JSON.stringify(events));
    }
}

// remove event from events array
// update page so event isn't displayed anymore
function deleteEvent(index) {
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    displayUpcomingEvents();
}

// get info of event being edited and display that in form for user to edit
function editEvent(index, parent) {
    // get info for event from events array
    let {name, date, startTime: sTime, endTime: eTime, details, category: categoryName} = events[index];

    // format date and times in way form will understand
    // convert month name to number and add zero if month is single digit
    let month = (monthNames.indexOf(date.slice(0, -8)) + 1 < 10) ? `0${monthNames.indexOf(date.slice(0, -8)) + 1}` : monthNames.indexOf(date.slice(0, -8)) + 1;
    let day = date.slice(-7, -5);
    let year = date.slice(-4);

    // add zero if hour is befor 10 AM
    sTime = (sTime[1] == ":") ? (`0${sTime}`) : sTime;
    eTime = (eTime[1] == ":") ? (`0${eTime}`) : eTime;

    let categoryHTML = `<select class="form-select" id="category">`;
    for (category of [...categoryList.keys()]) {
        if (categoryName == category) {
            categoryHTML += `<option value="${category}" selected>${category}</option>`;
        } else {
            categoryHTML += `<option value="${category}">${category}</option>`;
        }
    }
    categoryHTML += `</select>`;

    // create form to edit event
    let editHTML = `<input class="form-control" name="event-name" id="event-name" type="text" value="${name}">
                    ${categoryHTML}
                    <input class="form-control" name="event-date" id="event-date" value="${year}-${month}-${day}" type="date">
                    <input class="form-control" name="event-start-time" id="event-start-time" type="time" value="${sTime}">
                    <input class="form-control" name="event-end-time" id="event-end-time" type="time" value="${eTime}">
                    <input class="form-control" name="event-details" id="event-details" type="text" value="${details}">
                    <span id="error-message"></span>
                    <input type="button" class="update btn btn-primary" id="${index}" value="Update">`;

    // display form in event-info div for specific event
    parent.html(editHTML);
}

// get and display events for given day on page
function getEvents(day) {
    let eventDay = `${month} ${day} ${year}`;
    let todayIndex = [];
    let todaysEvents = [];

    if (localStorage.getItem("events") != null) {
        events = JSON.parse(localStorage.getItem("events"));
    }

    events.forEach(function(event, index) {
        if (eventDay == event.date) {
            todayIndex.push(index); // keep track of index of event in events array
            todaysEvents.push(event);
        }
    });

    let eventHTML = `<h5> Events for ${month} ${day}, ${year} </h5>`;

    // create event-info div for each event
    for (let i = 0; i < todaysEvents.length; i++) {
        let {name, date, startTime, endTime, details, category} = todaysEvents[i];
        let stString = formatTime(startTime);
        let etString = formatTime(endTime);

        eventHTML += `<div class="event-info"> <h5 id="event-name">${name}</h5>
        <p id="event-date">${date.slice(0, -5)},${date.slice(-5)}</p>
        <p id="event-category">Category: ${category}</p>
        <p id="event-time">${stString}-${etString}</p>
        <p id="event-details"> Details: ${details} </p>
        <span class="row btn-group col-6">
        <input type="button" class="edit btn btn-secondary col-3" id="${todayIndex[i]}" value="Edit"> 
        <input type="button" class="delete btn btn-danger col-5" id="${todayIndex[i]}" value="Delete"></div>
        </span>`;
    }

    // tell user if there are no events for a given day
    if (todaysEvents.length == 0) {
        eventHTML += "<p> No events for today </p>";
    }

    eventHTML += `<input type="button" id="${day}" class="add btn btn-primary" value="Add Event">`;

    // add event info divs to page
    $(".todays-events").html(eventHTML);
}

// delete event from events array and remove the div with event info on page
$(document).on('click', '.delete', function(event) {
    var index = $(this).attr('id');
    deleteEvent(index);
    $(this).parent().parent()[0].remove();
    displayEventsInCalendar();
});

$(document).on('click', '.edit', function(event) {
    // get index of event in events array
    var index = $(this).attr('id');
    // get event-info that edit button is located
    var parent = $(this).parent().parent();

    // call editEvent which will replace event info with form user can edit
    editEvent(index, parent);
});

function formatTime(timeString) {
    let st = Number(timeString.slice(0,2));
    let stString;

    if (st > 12) {
        stString = `${st - 12}${timeString.slice(2)} PM`;
    } else if (st == 12) {
        stString = `${timeString} PM`;
    } else {
        if (st == "00") {
            stString = `12:${timeString.slice(3)} AM`;
        } else {
            stString = `${timeString} AM`;
        }
    }

    return stString;
} 

// update event after user has edited it
$(document).on('click', '.update', function(event) {
    // get index of event in events array
    var index = $(this).attr('id');
    // get values from event edit form
    let name = sanitizeInput($(this).parent().children("#event-name").val());
    let date = $(this).parent().children("#event-date").val();
    let sTime = $(this).parent().children("#event-start-time").val();
    let eTime = $(this).parent().children("#event-end-time").val();
    let details = sanitizeInput($(this).parent().children("#event-details").val());
    let category = $(this).parent().children("#category").val();
    let errorMessage = $("#error-message");

    let year = date.slice(0,4);
    let month = monthNames[Number(date.slice(6,7)) - 1];
    let day = date.slice(8);

    date = `${month} ${day} ${year}`;

    let stString = formatTime(sTime);
    let etString = formatTime(eTime);

    // replace form with div displaying event information
    let eventHTML = `<h5 id="event-name">${name}</h5>
        <p id="event-date">${month} ${day}, ${year}</p>
        <p id="event-category">Category: ${category}</p>
        <p id="event-time">${stString}-${etString}</p>
        <p id="event-details"> Details: ${details} </p>
        <span class="row btn-group col-6">
        <input type="button" class="edit btn btn-secondary col-3" id="${index}" value="Edit"> 
        <input type="button" class="delete btn btn-danger col-5" id="${index}" value="Delete">
        </span>`;

    // error handling if user is missing forms (except details which is not required)
    if (name == "") {
        $("#name").css({"border": "solid rgba(255,0,0,.75) .25em"});
        errorMessage.html("Please give the event a name");
    } else if (sTime == "") {
        $("#name").css({"border": "none"});
        $("#start-time").css({"border": "solid rgba(255,0,0,.75) .25em"});
        errorMessage.html("Please give the event a start time");
    } else if (eTime == "") {
        $("#name").css({"border": "none"});
        $("#start-time").css({"border": "none"});
        $("#end-time").css({"border": "solid rgba(255,0,0,.75) .25em"});
        errorMessage.html("Please give the event a end time");
    } else if (date == "") {
        $("#event-name").css({"border": "none"});
        $("#event-start-time").css({"border": "none"});
        $("#event-end-time").css({"border": "none"});
        $("#event-date").css({"border": "solid rgba(255,0,0,.75) .25em"});
        errorMessage.html("Please give the event a date");
    } else {
        // if form input is valid
        $("#event-name").css({"border": "none"});
        $("#event-start-time").css({"border": "none"});
        $("#event-end-time").css({"border": "none"});
        $("#event-date").css({"border": "none"});
        errorMessage.html("");
        events[index] = {name: name, date: date, startTime: sTime, endTime: eTime, details: details, category: category};
        localStorage.setItem("events", JSON.stringify(events));
        $(this).parent().html(eventHTML);
        displayUpcomingEvents();
        displayEventsInCalendar();
    }
});

// adds event form when user clicks add event
$(document).on('click', '.add', function(event) {
    let day = $(this).attr('id');
    let options = ``;
    for (let [category, color] of categoryList) {
        options += `<option value="${category}">${category}</option>`;
    }
    $(".add-event").html(`<h3> Add Event </h3>
        <span id="event-date">Date: ${month} ${day}, ${year}</span> <br>
        <label for="name">Name:</label>
        <input class="form-control" name="name" id="name" type="text">
        <label for="category">Category:</label>
        <select class="form-control" id="category" name="category">
        ${options}
        </select>
        <label for="start-time">Start Time:</label>
        <input class="form-control" type="time" name="start-time" id="start-time">
        <label>End Time:</label>
        <input class="form-control" type="time" name="end-time" id="end-time">
        <label for="details">Details (Optional):</label>
        <textarea class="form-control" name="details" id="details"></textarea>
        <span id="error-message"></span>
        <button id="${day}" class="add-button btn btn-primary col-6">Add Event</button>`);
});

// adds event that user has given info for
$(document).on('click', '.add-button', function(event) {
    let day = $(this).attr('id');
    addEvent(day);
    // update display so event is shown on page
    displayUpcomingEvents();
    getEvents(day);
});

// when user clicks on day on calender the background turns green to show its been selected
$(document).on('click', 'td', function(event) {
    $("td").css("background-color", "transparent");
    $(".today").css("background-color", "aliceblue");
    $(this).css("background-color", "rgb(169, 196, 125)");

    // show events for given day
    let day = $(this).children("h6").text();
    if (day != "") {
        getEvents($(this).children("h6").text());
        $(".add-event").html("");
    }
});

// shows events occurring within the next week & current month in events div on page
function displayUpcomingEvents() {
    let eventHTML = "";
    if (localStorage.getItem("events") != null) {
        events = JSON.parse(localStorage.getItem("events"));
    }

    let upcomingEvents = events.filter(function(event) {
        let tempDate = new Date(event.date);
        let todaysDate = new Date();

        return (tempDate.getMonth() == todaysDate.getMonth() && (tempDate.getDate() >= todaysDate.getDate() && tempDate.getDate() <= todaysDate.getDate() + 7) && tempDate.getFullYear() == todaysDate.getFullYear());
    });

    for (let event of upcomingEvents) {
        let {name, date, startTime, endTime, details, category} = event;
        let stString = formatTime(startTime);
        let etString = formatTime(endTime);

        eventHTML += `<div class="event-info"> <h5>${name}</h5>
        <p>${date.slice(0, -5)},${date.slice(-5)} </p>
        <p id="event-category">Category: ${category}</p>
        <p>${stString}-${etString} </p>
        <p>Details: ${details}</p></div>`;
    }
    $(".events-div").html(eventHTML);
}

function displayHolidays(currentYear = new Date().getFullYear()) {
    $.get(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 1}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 2}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 3}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 4}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 5}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 6}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 7}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 8}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 9}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
    });

    $.get(`https://date.nager.at/api/v3/PublicHolidays/${Number(currentYear) + 10}/us`, (data) => {
        for (let holiday of data) {
            let date = new Date(`${holiday.date}T00:00`);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            events.push({name: holiday.name, date: `${monthNames[month]} ${day} ${year}`, startTime: "00:00", endTime: "23:59", details: "", category: "Holiday"});
        }
        
        if (localStorage.getItem("events") === null) {
            localStorage.setItem("events", JSON.stringify(events));  
        }

        displayUpcomingEvents();
        displayEventsInCalendar();
    });
}

// show list of category on page
function displayCategories() {
    let categoryHTML = ``;
    if (localStorage.getItem("categories") != null) {
        categoryList = new Map(JSON.parse(localStorage.categories));    
    }

    categoryList.forEach((color, name) => {
        categoryHTML += `<div><input type="checkbox" name="${name}" id="${name}" checked> <label style="color: ${color=="transparent" ? "black" : color}" for="${name}">${name}</label></div>`;
    });
    categoryHTML += `<div class="col cat-input"><label for="cat-name" class="form-label">Add category:</label><input type="color" id="cat-color" name="cat-color" class="form-control"><input type="text" name="cat-name" id="cat-name" class="form-control"><button id="add-cat" class="btn btn-primary">Add</button></div>`;
    $(".category-filter").html(categoryHTML);
    $("input[type='checkbox']").each(function() {
        this.addEventListener("change", filterCategory);
    })
    $("#add-cat")[0].addEventListener('click', addCategory);
}

function addCategory() {
    let catName = sanitizeInput($(this).parent().children("#cat-name").val());
    let catColor = $(this).parent().children("#cat-color").val();
    if (catName != "") {
        categoryList.set(catName, catColor);
        $(this).parent().children("#cat-name").val("");
        displayCategories(); 
        localStorage.categories = JSON.stringify(Array.from(categoryList.entries()));  
    }
}

function editCategory() {

}

function deleteCategory() {

}

function repeatingEvents() {

}

// show only events with category name when checkbox is clicked
function filterCategory(e) {
    let checked = e.target.checked;
    let name = e.target.name;
    if (!checked) {
        categoriesFiltered.delete(name);
    }
    if (checked) {
        categoriesFiltered.set(name, "");
    }
    displayEventsInCalendar([...categoriesFiltered.keys()]);
}

function displayEventsInCalendar(categories = [...categoryList.keys()]) {
    $("td .event").remove();

    let monthEvents = events.filter(function(event) {
        let tempDate = new Date(event.date);
        return (tempDate.getMonth() == date.getMonth() && tempDate.getFullYear() == date.getFullYear());
    });

    for (let event of monthEvents) {
        let tempDate = new Date(event.date);
        let td = $("td h6").filter(function(el) {
            var html = $("td h6")[el].innerHTML;
            return (html == tempDate.getDate());
        })
        if (categories.includes(event.category)) {
            td.parent().append(`<div style="background-color:${categoryList.get(event.category)}" class="event">${event.name}</div>`);
        }
    }
}

function getLocalStorage() {
    if (localStorage.getItem("events") === null) {
        //localStorage.setItem("events", JSON.stringify(events));  
    }

    if (localStorage.getItem("categories") === null) {
        localStorage.categories = JSON.stringify(Array.from(categoryList.entries()));
    }
}

$(document).ready(function() {
    let yearNum = Number(new Date().getFullYear());
    let monthNum = Number(new Date().getMonth());

    // add month and year dropdown menu to page
    let calendarHTML = `<select class="form-select col" id="month" name="month">`;

    for (let m = 0; m < 12; m++) {
        if (m == monthNum)
            calendarHTML += `<option selected> ${monthNames[m]} </option>`;
        else
            calendarHTML += `<option> ${monthNames[m]} </option>`;
    }
    
    calendarHTML += `</select><select class="form-select col" id="year" name="year"> 
    <option> ${yearNum} </option>
    <option> ${yearNum + 1} </option>
    <option> ${yearNum + 2} </option>
    <option> ${yearNum + 3} </option>
    <option> ${yearNum + 4} </option>
    <option> ${yearNum + 5} </option>
    <option> ${yearNum + 6} </option>
    <option> ${yearNum + 7} </option>
    <option> ${yearNum + 8} </option>
    <option> ${yearNum + 9} </option>
    <option> ${yearNum + 10} </option>
    </select>`;

    calendarHTML += `<button class="btn btn-primary col-2" type="button" onclick="getChosenDate()">Go</button>`;

    // add dropdowns and go button to options div above calendar
    $("#options").html(calendarHTML);
    
    // display calendar and events on page
    displayCalendar();
    displayUpcomingEvents();
    displayEventsInCalendar();
    displayCategories();

    getLocalStorage();
    displayHolidays();
});