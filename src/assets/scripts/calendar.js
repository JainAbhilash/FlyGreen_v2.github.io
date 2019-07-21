var userCalendarEvents = NaN;
var calendar = NaN;

document.addEventListener('DOMContentLoaded', function() {

    userCalendarEvents = new CalendarEventsHandler();
    var flightJson = JSON.parse(flightData);

    // Reset the calendar view
    function clearAllExtra() {
        if(current_selection !== 0) {
            current_selection.remove();
            current_selection = 0
        }

        goingFlightTable.innerHTML = "" 
        returningFlightTable.innerHTML = ""  
    }

    // After user selects a meeting time, populate a table of flights
    // Next meeting     - locationInput.value
    // meeting place    - titleInput.value
    // current_selection.start <- Meeting time
    //
    // Previous place   - previous_location (class)
    // Next place       - next_location (class)
    function getFlightList() {

        reset_flight_tables();
        previous_location = userCalendarEvents.get_previous_location(new_event.start);        
        next_location = userCalendarEvents.get_next_location(new_event.start);
        
        console.log(previous_location.place)
        console.log(titleInput.value)
        console.log(next_location.place)
        goingFlightTable.innerHTML = "" 
        returningFlightTable.innerHTML = ""  
        if(previous_location.place !== locationInput.value || previous_location.place !== home_country) {
            
            var bestGoing = get_top_going_flights(home_country, locationInput.value, current_selection.start, previous_location.latest);
            
            // Check if there is option to reroute a flight  
            var example1 = {
                from : "Reroute previous flight",
                to : "",
                start : "2019-06-11T10:00:00", 
                end : "2019-06-11T10:30:00", 
            }  
            //goingFlightTable.innerHTML += make_flight_table_item(example1, "0");

            score_array = [100, 85, 70];
            counter = 0;

            if (bestGoing.length === 0) {
                goingFlightTable.innerHTML += "<tr><td>No going flights found for the selected time</td></tr>"; // i = 0
            }

            

            // Append the best flights
            bestGoing.forEach(function(flights) {
                var example = {
                    from : previous_location.place,
                    to : locationInput.value,
                    start : flights.Departure, 
                    end : flights.Arrival,
                    score : score_array[counter],
                }  
                goingFlightTable.innerHTML += make_flight_table_item(example, "0");
                counter += 1
            })

            if (locationInput.value !== home_country) {
                var bestReturn = get_top_return_flights(locationInput.value, home_country, current_selection.start, next_location.earliest);
                if (bestReturn.length === 0) {
                    returningFlightTable.innerHTML += "<tr><td>No going flights found for the selected time</td></tr>"; // i = 0
                }
                var counter = 0;
                bestReturn.forEach(function(flights) {
                    var example = {
                        from : locationInput.value,
                        to : home_country,
                        start : flights.Departure, 
                        end : flights.Arrival,
                        score : score_array[counter],
                    }  
                    returningFlightTable.innerHTML += make_flight_table_item(example, "1");
                    counter += 1
                });
            } 
        }
        else {
            // We are already at the location
            goingFlightTable.innerHTML = "<tr><td>Previous meeting at the same place, no flight needed</td></tr>"     
        }
    }

    // Update the flight info on the side
    function updateSideInfo() {
        location_text = document.getElementById('meetingLocation');
        location_text.innerHTML = "Select flights for selected time";
    }

    // State tracker for the meeting process
    // 0 = info screen: not started
    // 1 = entering target location
    // 2 = selecting time slot
    // 3 = ??? needed?    
    new_meeting_state = 0;

    // placeholder for possible places for new meeting
    current_selection = 0;

    // Just home country
    home_country = "HEL-sky";

    var column_info = document.getElementsByClassName("column")[0];
    var column_location = document.getElementsByClassName("column1")[0];
    var column_calendar = document.getElementsByClassName("column2")[0];
    var column_flight_list = document.getElementsByClassName("column3 ")[0];

    var titleInput = document.getElementById("eventTitle");
    var locationInput = document.getElementById("city_select");
    var goingFlightTable = document.getElementById("goingFlightTable");
    var returningFlightTable = document.getElementById("returnFlightTable");
    var destinationCity = document.getElementById("city_select");

    button_confirm_event = document.getElementById('confirmEventInfo');
    button_finalize_meeting = document.getElementById('confirmFlights');
    // Confirm button clicked -> user can select time of the meeting
    button_confirm_event.addEventListener('click', function() {
        new_meeting_state = 2;
        column_location.style.display = "none";
        column_info.style.display = "none";
        column_flight_list.style.display = "block";
        
        updateSideInfo();
    }, false);

    // Reserve - Flights are booked -> save them to the calendar
    button_finalize_meeting.addEventListener('click', function() {
        column_info.style.display = "block";
        column_location.style.display = "none";
        column_flight_list.style.display = "none";
            
        current_selection = 0;
        clearAllExtra();
        finalize_flights();
        new_meeting_state = 0;
        this.innerHTML = 'Add calendar event';
    }, false);

    destinationCity.addEventListener("change", function() {
        if(this.value === "") {
            button_confirm_event.disabled = true;
        }
        else {
            button_confirm_event.disabled = false;
        }
    });

    var calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'interaction', 'timeGrid' ],
        hiddenDays: [  ],
        minTime: "08:00:00",
        maxTime: "21:00:00",

        dateClick: function(info) {
            // Location in calendar is clicked, if we at right state
            //      - add a placeholder for the event and update flight list
            if(new_meeting_state === 2) {
                clearAllExtra()

                new_event = {
                    title: titleInput.value + ", " + locationInput.value,
                    start: info.dateStr,
                    color: '#f5a742'
                }
                current_selection = calendar.addEvent(new_event);
                getFlightList()
            }
          },

        customButtons: {
            myCustomButton: {
              text: 'Add calendar event',
              click: function() {
                if(new_meeting_state === 0) {
                    column_location.style.display = "block";
                    column_info.style.display = "none";
                    column_flight_list.style.display = "none";

                    new_meeting_state = 1;
                    this.innerHTML = 'Cancel';
                }
                else {
                    column_info.style.display = "block";
                    column_location.style.display = "none";
                    column_flight_list.style.display = "none";
                        
                    clearAllExtra();
                    reset_all_vars();
                    new_meeting_state = 0;
                    this.innerHTML = 'Add calendar event';
                }
              }
            }
          },
        header: {
            left: 'prev,next,myCustomButton',
            center: 'title',
            right: 'timeGridWeek'
        },
        defaultDate: new Date().toJSON().slice(0,10),
        businessHours: true, // display business hours
        navLinks: false, // can click day/week names to navigate views

        weekNumbers: true,
        weekNumbersWithinDays: true,
        weekNumberCalculation: 'ISO',

        editable: false,
        eventLimit: true, // allow "more" link when too many events
        events: userCalendarEvents.get_user_all_events(),
    });

    calendar.render();
});
