
// red  - green - blue - purple 
some_colors = ["#f57842", "#45ad4b", "#358bb0", "#6a1e96"]
class CalendarEventsHandler {
    constructor() {
        this.locations = [];
        this.user_events = [];

        // MEETING 1
        var Helsinki_test = new TravelEvent("HEL-sky");
        var tmp = new Date(1563658151121);
        tmp.setHours(12)
        tmp.setDate(tmp.getDate()-2);
        tmp.setMinutes(0);
        Helsinki_test.addEvent("Meeting, Helsinki", tmp.toJSON(), some_colors[this.user_events.length]);
        tmp.setHours(14)
        Helsinki_test.addEvent("Meeting, Helsinki", tmp.toJSON(), some_colors[this.user_events.length]);
        this.user_events.push(Helsinki_test);
        
        // MEETING 2
        var tmp = new Date(1563658151121);
        tmp.setHours(10)
        tmp.setDate(tmp.getDate()-4);
        tmp.setMinutes(0);
        var London_test = new TravelEvent("AMS-sky")
        London_test.addEvent("Meeting, Amsterdam", tmp.toJSON(), some_colors[this.user_events.length]);
        tmp.setHours(12)
        London_test.addEvent("Meeting, Amsterdam", tmp.toJSON(), some_colors[this.user_events.length]);

        // MEETING 2 - flights
        tmp.setHours(8)
        London_test.addGoingFlight(tmp.toJSON());
        tmp.setDate(tmp.getDate());
        tmp.setHours(14)
        London_test.addRetuningFlight(tmp.toJSON());
        this.user_events.push(London_test);
    
        // MEETING 3
        var Helsinki_test = new TravelEvent("HEL-sky");
        var tmp = new Date(1563658151121);
        tmp.setDate(tmp.getDate() + 1 )
        tmp.setHours(11)
        tmp.setMinutes(0);
        Helsinki_test.addEvent("Meeting, Helsinki", tmp.toJSON(), some_colors[0]);
        tmp.setHours(14)
        Helsinki_test.addEvent("Meeting, Helsinki", tmp.toJSON(), some_colors[0]);
        this.user_events.push(Helsinki_test);
        
        // MEETING 4
        var Helsinki_test = new TravelEvent("MUC-sky");
        var tmp = new Date(1563658151121);
        tmp.setDate(tmp.getDate() + 3 )
        tmp.setHours(14)
        tmp.setMinutes(0);
        Helsinki_test.addEvent("Meeting, Munich", tmp.toJSON(), some_colors[1]);

        tmp.setHours(12)
        Helsinki_test.addGoingFlight(tmp.toJSON());
        tmp.setDate(tmp.getDate());
        tmp.setHours(17)
        Helsinki_test.addRetuningFlight(tmp.toJSON());
        this.user_events.push(Helsinki_test);

        // MEETING 4
        var Helsinki_test = new TravelEvent("AMS-sky");
        var tmp = new Date(1563658151121);
        tmp.setDate(tmp.getDate() + 5 )
        tmp.setHours(12)
        tmp.setMinutes(0);
        Helsinki_test.addEvent("Meeting, Amsterdam", tmp.toJSON(), some_colors[2]);
        tmp.setHours(14)
        Helsinki_test.addEvent("Meeting, Amsterdam", tmp.toJSON(), some_colors[2]);

        tmp.setHours(8)
        Helsinki_test.addGoingFlight(tmp.toJSON());
        tmp.setDate(tmp.getDate());
        tmp.setHours(16)
        Helsinki_test.addRetuningFlight(tmp.toJSON());
        this.user_events.push(Helsinki_test);

        // Meeting 5
        var Helsinki_test = new TravelEvent("AMS-sky");
        var tmp = new Date(1563658151121);
        tmp.setDate(tmp.getDate() + 8 )
        tmp.setHours(12)
        tmp.setMinutes(0);
        Helsinki_test.addEvent("Meeting, Amsterdam", tmp.toJSON(), some_colors[1]);
        tmp.setHours(14)
        Helsinki_test.addEvent("Meeting, Amsterdam", tmp.toJSON(), some_colors[1]);
        tmp.setHours(9)
        Helsinki_test.addGoingFlight(tmp.toJSON());
        tmp.setDate(tmp.getDate());
        tmp.setHours(16)
        Helsinki_test.addRetuningFlight(tmp.toJSON());
        this.user_events.push(Helsinki_test);

        // Meeting 6
        var Helsinki_test = new TravelEvent("AMS-sky");
        var tmp = new Date(1563658151121);
        tmp.setDate(tmp.getDate() + 12 )
        tmp.setHours(12)
        tmp.setMinutes(0);
        Helsinki_test.addEvent("Meeting, Amsterdam", tmp.toJSON(), some_colors[0]);
        tmp.setHours(14)
        Helsinki_test.addEvent("Meeting, Amsterdam", tmp.toJSON(), some_colors[0]);

        tmp.setHours(10)
        Helsinki_test.addGoingFlight(tmp.toJSON());
        tmp.setDate(tmp.getDate());
        tmp.setHours(16)
        Helsinki_test.addRetuningFlight(tmp.toJSON());
        this.user_events.push(Helsinki_test);



        this.locations.push("Finland");
        this.locations.push("UK");
    }

    // Given a Date(), return the previous TravelEvent object
    get_previous_location(queryTime) {
        var query = new Date(Date.parse(queryTime));
        var current = NaN;
        this.user_events.forEach(function(events) {
            if(events.latest < query) {
                if (current){
                    if(events.latest > current.latest) {
                        current = events
                    }
                }
                else {
                    current = events
                }
            }
        });
        return current
    }
    
    // Given a Date(), return next TravelEvent object
    get_next_location(queryTime) {
        var query = new Date(Date.parse(queryTime));
        var current = NaN;

        this.user_events.forEach(function(events) {
            if(events.latest > query) {
                if (current){
                    if(events.latest < current.latest) {
                        current = events
                    }
                }
                else {
                    current = events
                }
            }    
        });
        return current
    }

    // Return a list of object events that are accepted by the calendar
    // {
    //   title : string
    //   start : time
    //   color : ...
    // }
    get_user_all_events() {
        var user_events = []

        this.user_events.forEach(function(element) {
            
            // Flight to the country
            if(element.goingFlightTime) {
                user_events.push({
                    title: 'Flight to ' + element.place,
                    start: element.goingFlightTime,
                    color: element.color,
                });
            }

            element.meetings.forEach(function(meeting) {
                user_events.push(meeting);
            });

            // return from the country
            if(element.returningFlightTime) {
                user_events.push({
                    title: 'Return from ' + element.place,
                    start: element.returningFlightTime,
                    color: element.color,
                });
            }

            // Highlight the country duration
            if(element.returningFlightTime && element.goingFlightTime) {
                user_events.push({
                    start: element.earliest,
                    end: element.latest,
                    color: element.color,
                    rendering: 'background'
                });
            }
        });

        return user_events
    }
}

class TravelEvent {
// title: 'Meeting, Helsinki ',
// start: '2019-06-12T12:00:00',
// color: '#ff9f89'

    constructor(place) {
        this.place = place;
        this.meetings = [];
        
        this.earliest = new Date('2020-11-05')
        this.latest = new Date('2013-11-05')
    }

    addEvent(title, startTime, color) {
        this.meetings.push({
            title: title,
            start: startTime,
            color: color
        });

        var testing = Date.parse(startTime)   
        
        if(testing < this.earliest.getTime()) {
            this.earliest = new Date(testing)
        }

        if(testing + 500000 > this.latest.getTime()) {
            this.latest = new Date(testing + 500000)
        }
    }

    addGoingFlight(flightTime) {
        this.hasGoing = true
        this.goingFlightTime = flightTime
        this.earliest = new Date(Date.parse(flightTime))
    }

    addRetuningFlight(flightTime) {
        this.hasReturn = true
        this.returningFlightTime = flightTime
        this.latest = new Date(Date.parse(flightTime))
    }
}
