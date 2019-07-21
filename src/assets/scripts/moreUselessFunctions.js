var flightJson = JSON.parse(flightData);

// Sort dates by descending order
function sort_by_date( a, b ) {
    if ( a.Date > b.Date ){
      return -1;
    }
    if ( a.Date < b.Date ){
      return 1;
    }
    return 0;
  }


// Sort dates by descending order
function adssadsadsa( a, b ) {
  a.Arrival = new Date(Date.parse(a.Arrival))
  b.Arrival = new Date(Date.parse(b.Arrival))
  if ( a.Arrival < b.Arrival ){
    return -1;
  }
  if ( a.Arrival > b.Arrival ){
    return 1;
  }
  return 0;
}

// Somehow return some flights to be displayed in the UI
function get_top_going_flights(from, to, currentTime, beforeDate) {

    // Some TMP Lists
    N = 2
    topDays = [];
    bestFlights = [];
    var meeting_time = new Date(Date.parse(currentTime));
    var prev_meeting = new Date(Date.parse(beforeDate));

    console.log(from)
    console.log(to)
    console.log(meeting_time)
    console.log(prev_meeting)
    // Cut down the list to best dates
    flightJson.forEach(flight => {
        var departureDay = new Date(flight.Date);
        // Correct airports and day is before the meeting
        if (flight.Departure_airport == from && flight.Destination_airport == to && departureDay < meeting_time) {
          console.log(departureDay)
          topDays.push(flight);    
        }
    });

    console.log(topDays)
    topDays.sort(sort_by_date);

    
    
    // Loop the days 
    counter = 0;
    while (counter < topDays.length && bestFlights.length < N) {
      flithtDay = topDays[counter];

      
      tmp = flithtDay.Flights;
      tmp = tmp.sort(adssadsadsa)
      
      // Loop all flights of the day
      flithtDay.Flights.forEach(function(flight) {
        fArrive = new Date(Date.parse(flight.Arrival));  
        fDepart = new Date(Date.parse(flight.Departure)); 
        
        
        // Need to arrive before the meeting
        // Also, flight has to happen after last recoderd meeting 
        if (!beforeDate || (fArrive < meeting_time && prev_meeting < fDepart)) {
          // Flight should leave at calendar hours, becasue lazy
          if (fDepart.getHours() >= 8 && fArrive.getHours() <= 19 &&  flight.Duration < 350) {
            if(bestFlights.length < N) {
              bestFlights.push(flight)
            }
          }
        }
      });
      counter += 1;
    }

    return bestFlights
}


// So done with this -> copy pasta for other way
function get_top_return_flights(from, to, currentTime, nextEvent) {

  // Some TMP Lists
  N = 2
  topDays = [];
  bestFlights = [];
  var meeting_time = new Date(Date.parse(currentTime));
  var next_meeting = new Date(Date.parse(nextEvent));

  // Cut down the list to best dates
  flightJson.forEach(flight => {
      var departureDay = new Date(flight.Date);
      // Correct airports and day is before the meeting
      if (flight.Departure_airport == from && flight.Destination_airport == to && departureDay > new Date(meeting_time.getTime() - 24 * 3.6 * 1000000)) {
          topDays.push(flight);    
      }
  });
  topDays.sort(sort_by_date).reverse();
  
  // Loop the days 
  counter = 0;
  while (counter < (topDays.length - 1) && bestFlights.length < N) {
    flithtDay = topDays[counter];
    tmp = flithtDay.Flights;
    tmp = tmp.sort(adssadsadsa).reverse()
    
    // Loop all flights of the day
    flithtDay.Flights.forEach(function(flight) {
      fArrive = new Date(Date.parse(flight.Arrival));  
      fDepart = new Date(Date.parse(flight.Departure)); 
      
      // Need to leave after the meeting!
      if (fDepart > meeting_time.setHours(meeting_time.getHours() + 1)) {
        // Gotta arrive before next meeting
        if (!nextEvent || (fArrive < next_meeting)) {
          // Flight should leave at calendar hours, becasue lazy
          if (fDepart.getHours() >= 8 && fArrive.getHours() <= 19 &&  flight.Duration < 750) {
            if(bestFlights.length < N) {
              bestFlights.push(flight)
            }
          }
        }
      } 
    });
    counter += 1;
  }

  return bestFlights
}