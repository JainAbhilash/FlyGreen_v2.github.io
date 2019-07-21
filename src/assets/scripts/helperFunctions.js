
/*
Need to handle possible scenarios

1 - At home country, no flights after previous meeting
    - Just has to be a normal flight

2 - At home country, no meetigns after a flight
    - Reroute the flight from country x to home

3 - after flight to country, before meeting happens
    - Reroute previous flight
    - new flight to the new meeting

*/

var goingSelection = {
    mouseOverFlight : 0,
    fixedMouseoverTemplate : 0,
    fixedTmpFlight : 0,
    fixedFlightTime : 0
}

var returnSelection = {
    mouseOverFlight : 0,
    fixedMouseoverTemplate : 0,
    fixedTmpFlight : 0,
    fixedFlightTime : 0
}
var tmpBackground = 0;

function flightSelected(item) {
    mode = item.children[5].innerHTML
    // Make selected one clearly visible
    
    $('.flightTableRow' + mode).removeClass('bg-primary');
    item.classList.add("bg-primary");
    if(mode === "0") {   

        goingSelection.fixedMouseoverTemplate  = {
            title: 'Flight',
            start: item.children[3].innerHTML,
            end: item.children[4].innerHTML,
            color: '#f5a742'
        }
        goingSelection.fixedFlightTime =  item.children[3].innerHTML;
        goingSelection.fixedTmpFlight = calendar.addEvent(goingSelection.fixedMouseoverTemplate);
        
        if(goingSelection.mouseOverFlight !== 0) {
            goingSelection.mouseOverFlight.remove();
            goingSelection.mouseOverFlight = 0;
        }
    }
    else {
        returnSelection.fixedMouseoverTemplate = {
            title: 'Flight',
            start: item.children[3].innerHTML,
            end: item.children[4].innerHTML,
            color: '#f5a742'
        }
        returnSelection.fixedFlightTime =  item.children[3].innerHTML;
        returnSelection.fixedTmpFlight = calendar.addEvent(returnSelection.fixedMouseoverTemplate);
        
        if(returnSelection.mouseOverFlight !== 0) {
            returnSelection.mouseOverFlight.remove();
            returnSelection.mouseOverFlight = 0;
        }
    }

    is_both_selected();
}

function flightInspecting(item) {
    mode = item.children[5].innerHTML

    if(mode === "0") {   
        if(goingSelection.mouseOverFlight == 0) {
            new_event = {
                title: 'Flight',
                start: item.children[3].innerHTML,
                end: item.children[4].innerHTML,
                color: '#f5a742'
            }
            goingSelection.mouseOverFlight = calendar.addEvent(new_event);
        }
        
        if(goingSelection.fixedTmpFlight !== 0) {
            goingSelection.fixedTmpFlight.remove();
            goingSelection.fixedTmpFlight = 0;
        }
    }
    else {
        if(returnSelection.mouseOverFlight == 0) {
            new_event = {
                title: 'Return',
                start: item.children[3].innerHTML,
                end: item.children[4].innerHTML,
                color: '#f5a742'
            }
            returnSelection.mouseOverFlight = calendar.addEvent(new_event);
        }
        
        if(returnSelection.fixedTmpFlight !== 0) {
            returnSelection.fixedTmpFlight.remove();
            returnSelection.fixedTmpFlight = 0;
        }
    }
    is_both_selected();
}

function fligthInspectLeave(item) {
    mode = item.children[5].innerHTML

    if(mode === "0") {   
        if(goingSelection.mouseOverFlight !== 0) {
            goingSelection.mouseOverFlight.remove();
            goingSelection.mouseOverFlight = 0;
        }

        if(goingSelection.fixedMouseoverTemplate !== 0 && goingSelection.fixedTmpFlight === 0) { 
            goingSelection.fixedTmpFlight = calendar.addEvent(goingSelection.fixedMouseoverTemplate);
        }
    }
    else { 
        if(returnSelection.mouseOverFlight !== 0) {
            returnSelection.mouseOverFlight.remove();
            returnSelection.mouseOverFlight = 0;
        }

        if(returnSelection.fixedMouseoverTemplate !== 0 && returnSelection.fixedTmpFlight === 0) { 
            returnSelection.fixedTmpFlight = calendar.addEvent(returnSelection.fixedMouseoverTemplate);
        }
    }
    is_both_selected();
}


function is_both_selected() {
    
    if (tmpBackground !== 0) {
        tmpBackground.remove();
        tmpBackground = 0;
    }

    if(returnSelection.fixedTmpFlight !== 0 && goingSelection.fixedTmpFlight !== 0) {
        new_event = {
            title: 'duration',
            start: goingSelection.fixedFlightTime,
            end: returnSelection.fixedFlightTime,
            color: '#f5a742',
            rendering: 'background',
        }
        tmpBackground = calendar.addEvent(new_event);
    }
}

function reset_all_vars() {
    
    reset_flight_tables ();

    goingSelection = {
        mouseOverFlight : 0,
        fixedMouseoverTemplate : 0,
        fixedTmpFlight : 0,
        fixedFlightTime : 0
    }
    
    returnSelection = {
        mouseOverFlight : 0,
        fixedMouseoverTemplate : 0,
        fixedTmpFlight : 0,
        fixedFlightTime : 0
    }
    tmpBackground = 0;
}

function finalize_flights() {
    goingSelection = {
        mouseOverFlight : 0,
        fixedMouseoverTemplate : 0,
        fixedTmpFlight : 0,
        fixedFlightTime : 0
    }
    
    returnSelection = {
        mouseOverFlight : 0,
        fixedMouseoverTemplate : 0,
        fixedTmpFlight : 0,
        fixedFlightTime : 0
    }
    tmpBackground = 0;
}

// Should take a object
/*
{
    env-score   :
    from        : 
    to          :
    time        :
} 
????
*/
function make_flight_table_item(flightData, mode) {
    

    timeObject = new Date(Date.parse(flightData.start))
    timeStr = timeObject.toString().split(' ')[0];
    timeStr += timeObject.toString().split(' ')[4].substring(0,5);
    
    table_item = "<tr class=\"flightTableRow"+ mode +"\" onmouseover=\"flightInspecting(this)\" onmouseleave=\"fligthInspectLeave(this)\" onclick=\"flightSelected(this)\">" 
    table_item += "<td scope=\"row\">Score \n" + flightData.score +"</td>"; // i = 0
    table_item += "<td>" + flightData.from.substring(0,3) + " - " + flightData.to.substring(0,3) + "</td>"; // i = 1
    table_item += "<td>" + timeStr +"</td> "; // i = 2
    table_item += "<td style='display:none;'>" + flightData.start +"</td>"; // i = 3
    table_item += "<td style='display:none;'>" + flightData.end +"</td>"; // i = 4
    // 0 = going, 1 = return
    table_item += "<td style='display:none;'>" + mode +"</td>"; // i = 5
    table_item += "</tr>";

    return table_item
}


function reset_flight_tables() {

    if(goingSelection.mouseOverFlight !== 0) {
        goingSelection.mouseOverFlight.remove();
        goingSelection.mouseOverFlight = 0;
    }

    if(goingSelection.fixedTmpFlight !== 0) {
        goingSelection.fixedTmpFlight.remove();
        goingSelection.fixedTmpFlight = 0;
    }

    if(returnSelection.mouseOverFlight !== 0) {
        returnSelection.mouseOverFlight.remove();
        returnSelection.mouseOverFlight = 0;
    }

    if(returnSelection.fixedTmpFlight !== 0) {
        returnSelection.fixedTmpFlight.remove();
        returnSelection.fixedTmpFlight = 0;
    }

    if (tmpBackground !== 0) {
        tmpBackground.remove();
        tmpBackground = 0;
    }
}