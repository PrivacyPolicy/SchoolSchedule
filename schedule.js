// alter these variables to contain your class's information
var courses = [
    /*
    new Course("Design I", "skyblue", 3, 3),//0
    new Course("Computer Architecture & Organization", "green", 3, 4),//1
    new Course("Applied Cryptography", "orange", 3, 4),//2
    new Course("Software Security Testing", "#DDD", 3, 4),//3
    new Course("Engineering and Technology Project Management", "#492F92", 3, 3),//4
    new Course("Legal, Ethical, and Management Issues in Technology", "#222", 3, 2),//5
    new Course("Ethics", "olive", 1, 2),//6
    new Course("Computer Programming 2", "red", 3, 3),//7
    new Course("Database 1", "yellow", 3, 3),//8
    new Course("Ethical Hacking", "#AAA", 3, 4),//9
    new Course("Digital Forensics", "#333", 3, 4),//10
    new Course("Programming Languages", "lightblue", 3, 4),//11
    new Course("Machine Learning", "tan", 3, 4)//12
    */
    ];
var classes = [
    /*
    //new Class(0, "15:30-16:20 T, 9:00-11:05 F", "Staff"),
    //new Class(0, "15:30-16:20 T, 10:30-12:35 F", "Staff"),
    //new Class(0, "15:30-16:20 T, 13:30-15:35 F", "Staff"),
    new Class(0, "16:30-17:20 T, 10:30-12:35 F", "Staff"),
    new Class(0, "16:30-17:20 T, 13:30-15:35 F", "Staff"),
    
    new Class(1, "8:00-9:50 MW", "David Foster"),
    new Class(1, "10:00-11:50 MW", "Staff"),
    new Class(1, "16:00-17:50 MW", "David Foster"),
    new Class(1, "16:00-17:50 MW", "Staff"),
    
    new Class(2, "15:00-16:15 MW", "Youssif Al-Nashif"),
    new Class(2, "15:00-16:15 TR", "Staff"),
    
    new Class(3, "9:00-10:15 TR", "Staff"),
    new Class(5, "8:00-9:15 TR", "Staff"),
    new Class(9, "14:30-15:45 TR", "Staff"),
    new Class(10, "12:00-13:15 TR", "Staff"),
    
    
    new Class(4, "16:30-17:45 TR", "Jim Mennie"),
    new Class(4, "18:00-19:15 TR", "Jim Mennie"),
    new Class(4, "12:00-14:30 M", "Shoaib Shaikh"),
    
    new Class(6, "9:30-10:20 M", "Staff"),
    new Class(6, "10:30-11:20 M", "Staff"),
    new Class(6, "13:30-14:20 T", "Staff"),
    new Class(6, "14:30-15:20 W", "Staff"),
    new Class(6, "15:30-16:20 W", "Staff"),
    new Class(6, "13:30-14:20 R", "Staff"),
    
    
    new Class(7, "8:00-9:50 TR", "Staff"),
    new Class(7, "14:00-15:50 TR", "Staff"),
    
    new Class(8, "10:30-11:45 MW", "Jennifer Staab"),
    new Class(8, "10:30-11:45 TR", "Staff"),
    
    new Class(11, "13:30-14:45 TR", "Staff"),
    new Class(11, "15:00-16:15 MW", "Staff"),
    new Class(11, "15:00-16:15 MW", "Staff"),
    
    
    new Class(12, "13:30-14:45 TR", "Feng Jen Yang"),
    new Class(12, "16:30-17:45 TR", "Sherif Rashad")
    */
    
    ];
var results = [];

// Constructors
function Course(name, color, credits, year) {
    this.name = name;
    this.color = color;
    this.credits = credits;
    this.year = year;
    return this;
}
function Class(course, timeData, prof) {
    this.course = course;
    this.timeData = timeData;
    this.prof = prof;
    return this;
}

// constants and variables for use in the algorithm.
// these get updated with the user inputs
const transparent = "rgba(0, 0, 0, 0)",
      TAKEN = "taken";
var milTime = false,
    goalCredits = 16,
    exactCredits = true,
    earliest = 900,
    latest = 1800,
    mustContain = [0, 1, 2],
    notOnDays =  [];


// jQuery equivalent of onload. This is called when the page loads
$(document).ready(function() {

    // add the time values on the left and populate the empty table
    for (var i = 8 - 1; i < 12 + 7 - 1; i++) {
        for (var j = 0; j < 4; j++) {
            var text = (i + 1) + ":" + to2Str(j * 15);
            $("tbody").append("<tr><td title=" + text + ">" + text +
                "</td><td></td><td></td><td></td><td></td><td></td>");
        }
    }
    
    var input = $("#curPage");
    $("#run").click(function() { // when the calculate button is pressed
        this.disabled = true;
        $("#spinner").removeClass("displaynone");
        redTheBadTimes();
        
        window.setTimeout(function() {
            results = [];
            resetSchedule();
            solveSchedules(0); // recursive call, after which "results" will contain an array of integer lists
            input[0].value = 0;
            if (exactCredits) {
                for (var i = results.length - 1; i >= 0; i--) {
                    if (creditsOfResult(i) != goalCredits) { // reject any without exactly the right amount of credits
                        results.splice(i, 1);
                    }
                }
            }
            if (results.length > 0) {
                input[0].max = results.length - 1;
                alert("Calculation Completed!\nTotal: "+results.length);
            } else {
                input[0].max = 0;
                alert("Calculation Completed, no schedule exists.");
            }
            showResult(0);// display the result
            $("#run")[0].disabled = false;
            $("#spinner").addClass("displaynone");
        }, 10);
    });
    
    // when any of the inputs are clicked or changed, the below handle those events
    input.change(function() {
        var curVal = parseInt(input[0].value);
        if (curVal > results.length) {
            input.value = --curVal;
        }
        showResult(curVal);
    });
    $("#delete").click(function() {
        var ind = input[0].value;
        results.splice(ind, 1);
        input[0].value = --ind;
        showResult(ind);
        input[0].max = results.length - 1;
    });
    
    $("#mil_time").click(function() {
        milTime = this.checked;
        cellsToMilTime();
        showResult(input[0].value);
    });
    $("#goal_credits").change(function() {
        goalCredits = this.value;
    })[0].value = goalCredits;
    $("#exact").click(function() {
        exactCredits = this.checked;
    })[0].checked = exactCredits;
    $("#earliest").change(function() {
        earliest = timeToInt(this.value);
    })[0].value = to2Str(earliest/100) + ":00";
    $("#latest").change(function() {
        latest = timeToInt(this.value);
    })[0].value = to2Str(latest/100) + ":00";
    
    $("#must_contain").html(null);
    for (var i = 0; i < courses.length; i++) {
        $("#must_contain").append("<input type=checkbox" +
            " value=" + i + " name=must_have>" +
            courses[i].name + "<br>");
    }
    var mustHaves = $("[name=must_have]");
    for (var i = 0; i < mustHaves.length; i++) {
        mustHaves[i].addEventListener("click", function() {
            mustContain = [];
            for (var j = 0; j < mustHaves.length; j++) {
                if (mustHaves[j].checked) {
                    mustContain.push(j);
                }
            }
        });
        mustHaves[i].checked = (mustContain.indexOf(i) != -1);
    }
    var onlyOns = $("[name=on_days]");
    for (var i = 0; i < onlyOns.length; i++) {
        onlyOns[i].addEventListener("click", function() {
            notOnDays = [];
            for (var j = 0; j < onlyOns.length; j++) {
                if (!onlyOns.eq(j)[0].checked) {
                    var day = "";
                    switch (j) {
                        case 0:
                            day = "M";
                            break;
                        case 1:
                            day = "T";
                            break;
                        case 2:
                            day = "W";
                            break;
                        case 3:
                            day = "R";
                            break;
                        case 4:
                            day = "F";
                            break;
                    }
                    notOnDays.push(day);
                }
            }
        });
        var intNotOnDays = [];
        for (var n in notOnDays) {
            intNotOnDays[n] = dayToInt(notOnDays[n]) - 2;
        }
        for (var j = 0; j < 5; j++) {
            onlyOns.eq(j)[0].checked = (intNotOnDays.indexOf(j) == -1);
        }
    }
    
    cellsToMilTime(false); // turn the time to regular person time, not military time
    
    
    // convert user input into actual data
    $("#input_courses > .save").click(function() {
        var a = $("#form_cn").val(),
            b = $("#form_cl").val(),
            c = $("#form_cr").val(),
            d = $("#form_lv").val();
        courses.push(new Course(a, b, parseInt(c), parseInt(d)));
        $("#form_cn").val(null);
        $("#form_cl").val("#aaaaaa");
        $("#form_cr").val(3);
        $("#form_lv").val(3);
    });
    $("#input_courses > .done").click(function() {
        $("#input_courses").addClass("displaynone");
        $("#input_classes").removeClass("displaynone");
        var select = $("#input_classes > select");
        for (var i in courses) {
            select.append("<option value=" + i + ">" + courses[i].name +
                          "</option>");
        }
    });
    $("#input_classes > .save").click(function() {
        var a = $("#form_cc").val(),
            b = $("#form_ti").val(),
            c = $("#form_pr").val();
        classes.push(new Class(parseInt(a), b, c));
        $("#form_cc").val(-1);
        $("#form_ti, #form_pr").val(null);
    });
    $("#input_classes > .done").click(function() {
        $("#input_classes").addClass("displaynone");
        $("#blackground").addClass("displaynone");
        
        $("#must_contain").html(null);
        for (var i = 0; i < courses.length; i++) {
            $("#must_contain").append("<input type=checkbox" +
                " value=" + i + " name=must_have>" +
                courses[i].name + "<br>");
        }
        var mustHaves = $("[name=must_have]");
        mustContain = [];
        for (var i = 0; i < mustHaves.length; i++) {
            mustHaves[i].addEventListener("click", function() {
                mustContain = [];
                for (var j = 0; j < mustHaves.length; j++) {
                    if (mustHaves[j].checked) {
                        mustContain.push(j);
                    }
                }
            });
            mustHaves[i].checked = false;
        }
    });
    
});


// recursive function to find all schedules. It takes into account all of your configurations
// please don't make me comment the inside of it, it's a mess as it is
var credits = 0;
var current = [];
var curResult = [];
function solveSchedules(courseInd) {
    var theCourse = courses[courseInd];
    var canCont = true;
    if (current.length >= mustContain.length + 1 &&
        mustContain.length > 0) {
        for (var i in mustContain) {
            if (current.indexOf(mustContain[i]) == -1) {
                canCont = false;
            }
        }
    }
    if (canCont) {
        for (var i in classes) {
            var theClass = classes[i];
            if (theClass.course == courseInd) {

                if ( isSpotValid(theClass.timeData) ) {
                    addClass(theClass.timeData, theCourse.name,
                             theClass.prof, theCourse.color,
                             theCourse.year);
                    credits += theCourse.credits;
                    current[current.length] = courseInd;
                    curResult[curResult.length] = i;
                    if (courseInd < courses.length - 1 &&
                        credits < goalCredits) {
                        solveSchedules(courseInd + 1);
                    } else {
                        if (hasAllRequiredCourses()) {
                            console.log("Found a valid schedule!");
                            saveSchedule();
                        }
                    }
                    // backtrack call
                    removeClass(theClass.timeData);
                    credits -= theCourse.credits;
                    current.pop();
                    curResult.pop();
                }
            }
        }
    }
    if (courseInd < courses.length) {
        solveSchedules(courseInd + 1);
    }
}

// check if the spot is valid. If so, place it.
function displayClassForId(i) {
    aClass = classes[i];
    aCourse = courses[aClass.course];
    if (isSpotValid(aClass.timeData)) {
        addClass(aClass.timeData, aCourse.name,
                 aClass.prof, aCourse.color, aCourse.year);
    } else {
        console.log("Invalid location");
    }
}
    
// Display a single result from the list of calculated results. It is displayed on the main table
function showResult(ind) {
    if (results.length != 0) {
        resetSchedule();
        //redTheBadTimes();
        var res = results[ind].split(","),
            theCredits = 0;
        for (i in res) {
            var id = parseInt(res[i]);
            displayClassForId(id);
            theCredits += courses[classes[id].course].credits;
        }
        $("#credits").text(theCredits);
    }
}
    
// calculate the credit value of a specific schedule from the results
function creditsOfResult(ind) {
    if (results.length != 0) {
        var res = results[ind].split(","),
            theCredits = 0;
        for (i in res) {
            var id = parseInt(res[i]);
            theCredits += courses[classes[id].course].credits;
        }
        return theCredits;
    }
}

// apply a red background to the times specified as "too early" and "too late"
function redTheBadTimes() {
    var trs = document.getElementById("table").children[1].children;

    for (var i = 0; i < trs.length; i++) {
        var timeTd = trs[i].children[0];
        var cell = $("#table >tbody>tr:nth-child(" +
                    (i + 1) + ")>td:first-child");
        if (timeToInt(timeTd.title) < earliest ||
            timeToInt(timeTd.title) >= latest) {
            cell.addClass("red");
        } else {
            cell.removeClass("red");
        }
    }
}

// check if the currently displayed schedule contains all of the user-required courses
function hasAllRequiredCourses() {
    var data = $("#table > tbody").html();
    for (var i in mustContain) {
        var str = courses[mustContain[i]].name
            .split("&").join("&amp;");
        if (data.indexOf(str) == -1) {
            return false;
        }
    }
    return true;
}

// simple function to return a string of x spaces
function xSpaces(x) {
    var str = "";
    for (var i = 0; i < x; i++) {
        str += " ";
    }
    return str;
}

// add the list to the results array
function saveSchedule() {
    results.push(curResult.toString());
}

// unused
function deleteTable(elem) {
    var par = elem.parentElement;
    var prev = elem.previousElementSibling;
    var next = elem.nextElementSibling;
    par.removeChild(prev.previousElementSibling);
    par.removeChild(prev);
    par.removeChild(next.nextElementSibling);
    par.removeChild(next);
    par.removeChild(elem);
}

// resets the table to all blank values
function resetSchedule() {
    $("#table td:not(:first-child)").html("")
        .css("background", "transparent").removeClass(TAKEN)
        .attr("title", null);
}

// changes the entire page to military time or normal time, depending on the user's selection
function cellsToMilTime() {
    var ind = 0;
    for (var i = 8 - 1; i < 12 + 7 - 1; i++) {
        var hour = (milTime) ? (i + 1) : ( (i) % 12 + 1 );
        for (var j = 0; j < 4; j++) {
            var visual = hour + ":" + to2Str(j * 15);
            var title = (i + 1) + ":" + to2Str(j * 15);
            $("tbody>tr>td:first-child").eq(ind++)
                .attr("title", title).text(visual);
        }
    }
}

// takes an int and turns it into a string with two characters, e.g. 4 -> "04"
function to2Str(value) {
    var str = value + "";
    return ( (str.length == 1) ? "0" : "" ) + str;
}

// converts "13:00" to 1300
function timeToInt(time) {
    return parseInt(time.split(":").join(""));
}

// converts a string "day" into a usable integer, plus two for some reason.
function dayToInt(day) {
    var int;
    switch (day) {
        case "M":
            int = 0;
            break;
        case "T":
            int = 1;
            break;
        case "W":
            int = 2;
            break;
        case "R":
            int = 3;
            break;
        case "F":
            int = 4;
            break;
        default:
            int = -3;
    }
    return int + 2;
}

// timesData format: "8:30-10:15 M, 9:30-10:45 RF"
// given a time interval, check to see if that spot on the table is available for during this time
function isSpotValid(timesData) {
    var times = timesData.split(", ");
    for (jkljkljkl in times) {
        var m = times[jkljkljkl].split(" "),
            n = m[0].split("-"),
            start = n[0],
            end = n[1],
            days = m[1];
        
        if (timeToInt(start) < earliest ||
            timeToInt(end) > latest) return false;
        
        
        var trs = $("#table>tbody > tr");
        var ind = 0;
        
        // check if open spots. If not, cancel
        for (var i = 0; i < trs.length; i++) {
            if (trs.eq(i + 1)[0]) {
                var timeTd = trs.eq(i + 1)[0].children[0];
                var cell;
                if (timeToInt(timeTd.title) > timeToInt(start)) {
                    for (var j = 0; j < days.length; j++) {
                        
                        // on a day speicifically labelled "no-no"
                        if (notOnDays.indexOf(days[j]) > -1) {
                            return false;
                        }
                        
                        cell = $("#table >tbody>tr:nth-child(" +
                                 (i + 1) +
                                 ")>:nth-child(" +
                                 dayToInt(days[j]) + ")");
                        //cell.css("background", "yellow");
                        if (cell.hasClass(TAKEN)) {
                            //cell.css("background", "red");
                            return false;
                        }
                        //cell.css("background", "transparent");
                    }
                    if (timeToInt(timeTd.title) >= timeToInt(end)) {
                        break;
                    }
                }
            }
        }
    }
    return true;
}

// add a class at this location on the table (does not check for override)
function addClass(timesData, name, prof, color, year) {
    var times = timesData.split(", ");
    for (jkljkljkl in times) {
        var m = times[jkljkljkl].split(" "),
            n = m[0].split("-"),
            start = n[0],
            end = n[1],
            days = m[1];
        
        
        var trs = $("#table>tbody > tr");
        var ind = 0;
        
        // if all spots are open, start placing
        
        for (var i = 0; i < trs.length; i++) {
            if (trs.eq(i + 1)[0]) {
                var timeTd = trs.eq(i + 1)[0].children[0];
                var cell;
                if (timeToInt(timeTd.title) > timeToInt(start)) {
                    ind++;
                    
                    for (var j = 0; j < days.length; j++) {
                        cell = $("#table >tbody>tr:nth-child(" +
                                 (i + 1) +
                                 ")>:nth-child(" + dayToInt(days[j]) +
                                 ")");
                        cell.css("background", color);
                        cell.addClass(TAKEN);

                        // add info
                        if (cell) {
                            switch (ind) {
                                case 1:
                                    cell.html("<div>(" + year + ") " +
                                              name + "</div>");
                                    break;
                                case 2:
                                    var text = start + "-" + end + " " +
                                              days;
                                    if (!milTime) {
                                        text = text
                                            .split("13:").join("1:")
                                            .split("14:").join("2:")
                                            .split("15:").join("3:")
                                            .split("16:").join("4:")
                                            .split("17:").join("5:")
                                            .split("18:").join("6:");
                                    }
                                    cell.text(text);
                                    break;
                                case 3:
                                    cell.text(prof);
                                    break;
                                default:
                                    break;
                            }
                            cell.attr("title", name + "\n" + start +
                                      "-" + end + " " + days + "\n" +
                                      prof);
                        }
                    }
                    if (timeToInt(timeTd.title) >= timeToInt(end)) {
                        break;
                    }
                }
            }
        }
        
    }
    
    
    
    return true;
}

// removes the class from the specified location on the table
function removeClass(timesData) {
    var times = timesData.split(", ");
    for (jkljkljkl in times) {
        var m = times[jkljkljkl].split(" "),
            n = m[0].split("-"),
            start = n[0],
            end = n[1],
            days = m[1];
        
        
        var trs = $("#table > tbody > tr");
        var ind = 0;
        for (var i = 0; i < trs.length; i++) {
            if (trs.eq(i + 1)[0]) {
                var timeTd = trs.eq(i + 1)[0].children[0];
                var cell;
                if (timeToInt(timeTd.title) > timeToInt(start)) {
                    ind++;
                    for (var j = 0; j < days.length; j++) {
                        cell = $("#table>tbody>tr:nth-child(" + (i + 1) +
                                ")>:nth-child(" + dayToInt(days[j]) + ")");
                        cell.css("background", "transparent");
                        cell.removeClass(TAKEN);

                        // remove info
                        if (cell) {
                            cell.html("");
                            cell.attr("title", null);
                        }
                    }
                    if (timeToInt(timeTd.title) >= timeToInt(end)) {
                        break;
                    }
                }
            }
        }
    }
}



                    
                    
