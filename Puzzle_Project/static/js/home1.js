$(function () {
    // variables   
    var CustomState = false;  // used?    
    var init;
    var empty = [];
    var tempState = [];
    var state_size;
    var sizeOfPex;
    var period;
    var sol_path = [];
    var zeroID;
    var isSolveable;
    var pathCost;
    var maxStoredNodes;
    var numProcessedNodes;
    var timeTaken;
    var searchMode= false;    
    var stopClicked = false;
    // initalize
    generateRandomState(3,true);
   
//   events
    $(".button").mouseenter(function () {
        $(this).css("cursor", "pointer");
    });

    // Button hover effect
    $(".button").hover(function () {
        $(this).css({ background: "white", color: "black" });
    }, function () {
        $(this).css({ background: "#34495e", color: "#ebebeb" });
    });

    $('#sizeNbox').keydown(function (e) {
         checkIntegerInput(1,2);
    });
    $('#sizeNbox').keyup(function (e) {
        checkIntegerInput(1,2);
    });
    $("#sizeNbox").change(function(){
        newRandomState();
        hideStatisticsIfThere();
    });

    $("#randombtn").click(function() {
        newRandomState();
    });

    $("#custombtn").click(function () {
        showEnterCustomState();
      
    });

    $("#manualSubmit").submit(function (e) {
        e.preventDefault();
        saveManualState();
    });
 
    $("#saveState").click(function () {
        saveManualState();

    });

    $("#cancelbtn").click(function() {
        $('#container').css('visibility', 'hidden');
        $('#container').css('display', 'none');
        showManulaDetails();
    });
    $("#cancelbtnWithRetry").click(function() {
        $('#container').css('visibility', 'hidden');
        $('#container').css('display', 'none');
        showManulaDetails();
    });
    $("#retryManual").click(function () {
        showManulaDetails();
     
    });

    $("#stopbtn").click(function(){
        stopBtnAlgo();
    });

    $('#depth-size').keydown(function (e) {
        checkIntegerInput(Infinity,0);
   });
   $('#depth-size').keyup(function (e) {
       checkIntegerInput(Infinity,0);
   });

    $("#cancelbtnForDepth").click(function(){
        $('#depthcontainer').css('visibility', 'hidden');
        $('#depthcontainer').css('display', 'none');
    });
    $("#saveDepth").click(function(){
        submitDepth();
    });
    $("#depthForm").submit(function (e) {
        e.preventDefault();
        submitDepth();
    });

    $("#solvebtn").click(function () {
        var ready = readyToSolve();
         if(!ready){
             return; 
         }
         var isDLFS =  ckeckIfDLFS();
         if(isDLFS ){ // we will search in submitDepth(), after getting depth
             return;
         }
         searchAlgo();
     });
// functions

    function generateRandomState(sizeofState,firstTime){
        $.ajax({
            type: 'POST',
            async:false,
            url: 'generate_state/',
            data: {
                size: sizeofState,
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            },
            success: function (data) {
                SaveData(data.state);
               
                if(firstTime){
                        buildBoard();         
                        $("#game").show().animate({ left: "0px" }, 900);
            }
                else{
                    $("#game").empty();
                    buildBoard();
                }
            }
        });
        
        if(solvedState())
            generateRandomState(sizeofState,false);
    }

    function newRandomState() {
        var size = $("#sizeNbox").val();
        generateRandomState(size,false);
    }

});
function checkIntegerInput(max_chars,minValue) {
    if ($(this).val().length >= max_chars) {
        $(this).val($(this).val().substr(0, max_chars));
    }
    if ($(this).val() < minValue ) {
        $(this).val("");
    }
}
var gameSize = String($("#game").width());
var checkGoalInterval = setInterval(boxInCorrectPosition,10);
var checkSolvedByUser = setInterval(solvedByUser,10);

function showEnterCustomState() {
    var expampleState = "";
    var sizenbox = Number($("#sizeNbox").val());
    var size = ((sizenbox) * (sizenbox));
    var i = 1;
    for (i = 1; i < size - 1; i++) {
        expampleState += i + "-";
    }
    expampleState += 0 + "-";
    expampleState += i;

    $("#exampleSameSize").text("e.g. " + expampleState);
    $('#container').css('visibility', 'visible');
    $('#container').css('display', 'block');
}


function checkTextDash(str) {
    var size = str.length;
    var countDash = 0;
    for (var i = 0; i < size; i++) {
        var c = str.charAt(i);
        if (c === '-')
            countDash++;
    }
    var stateSize = Number($("#sizeNbox").val());
    if (countDash === (stateSize * stateSize - 1))
        return true;
    else
        return false;
}
function checkArrayState(arr) {
    var hash = {};
    var stateSize = Number($("#sizeNbox").val());
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] in hash)
            return false;
        if (arr[i] > (stateSize * stateSize - 1) ||  !$.isNumeric(arr[i]) )
            return false;

        hash[arr[i]] = true;
    }
    return true;
}

function saveManualState() {
    var text = $("#stateNumbers").val();
    var state = text.split("-").map(Number);
    if (checkTextDash(text) && checkArrayState(state)) { // no syntax error
        isSolvable(state);
        var solvable = getStateIsSolvable();
        
        if (!solvable) {
            $("#saveState").css("display", "none");
            $("#cancelbtn").css("display", "none");
            $("#exampleSameSize").css("display", "none");
            $("#stateNumbersContainer").css("display", "none");
            $("#firstexplain").text("The state is not solvable ! (you can retry )");
            $("#manualMessage").show().animate({ left: "0px", opacity: 1 }, 1100);
        }
        else {
            SaveData(state);
            $("#game").empty();
            buildBoard();
            $('#container').css('visibility', 'hidden');
            $('#container').css('display', 'none');
        }
    }
    else { // syntax error!
        $("#saveState").css("display", "none");
        $("#cancelbtn").css("display", "none");
        $("#exampleSameSize").css("display", "none");
        $("#stateNumbersContainer").css("display", "none");
        $("#firstexplain").text("Syntax error please check the example ! (you can retry )");
        $("#manualMessage").show().animate({ left: "0px", opacity: 1 }, 1100);
    }
}

function showManulaDetails() {
    $("#manualMessage").css("display", "none");
    $("#firstexplain").text("Enter game state, from top-left to right-bottom (do not forget '-' between numbers)");
    $("#exampleSameSize").show().animate({ left: "0px", opacity: 1 }, 1100);
    $("#stateNumbersContainer").show().animate({ left: "0px", opacity: 1 }, 1100);
    $("#saveState").show().animate({ left: "0px", opacity: 1 }, 1100);
    $("#cancelbtn").show().animate({ left: "0px", opacity: 1 }, 1100);
}
function getMovables() {
    var movables = [];
    $(".piece").each(function () {
        var id = $(this).attr('id');
        var coor = [Number(id[0]), Number(id[1])];
        if (Math.abs(empty[0] - coor[0]) + Math.abs(empty[1] - coor[1]) === 1)
            movables.push(id);
    });
    return movables;
}
function setStateIsSolvable(f) {
    isSolveable = f;
}
function getStateIsSolvable() {
    return isSolveable;
}
function isSolvable(lst) {
    $.ajax({
        async: false,
        type: 'POST',
        url: 'check_isSolvable/',
        data: {
            state: JSON.stringify(lst),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        }
        , success: function (data) {
            setStateIsSolvable(data.flag);
        }
    });


}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function SaveData(state) {
    tempState = state;
    state_size = Number(Math.sqrt(tempState.length));
    sizeOfPex = Number(gameSize/state_size)-2;
    init = initial_state(state_size,tempState);
    zeroID = getKeyByValue(init, 0);
  
}

function setSolution(sol, path, processedNodes, maxStored, timetake) {
    sol_path = sol;
    pathCost = path;
    numProcessedNodes = processedNodes;
    maxStoredNodes = maxStored;
    timeTaken = timetake;
    shuffle();
}

function showStaistics() {   
    $("#firstp").text("Time taken = " + timeTaken+" s");
    $("#secondp").text("Path cost = " + pathCost);
    $("#thirdp").text(" Processed nodes = " + numProcessedNodes);
    $("#forthp").text(" Maximum number of nodes = " + maxStoredNodes);
    $("#dialogForGame").hide();
    $("#statistic").show().animate({ left: "0px" }, 900);
}

function initial_List(dic) {
    var lst = [];
    var count = 0;
    for (var i = 0; i < state_size; i++)
        for (var j = 0; j < state_size; j++) {
            lst[count++] = dic[j + "" + i];
        }
    return lst;
}

function initial_state(size,tempState) {
    var stateCounter = 0;
    var init = {};
    for (var i = 0; i < size; i++)
        for (var j = 0; j < size; j++) {
            init["" + j + "" + i + ""] = tempState[stateCounter++];
        }
    return init;

}

var Depth = 0;
function setDepth(d) {
    Depth = d;
}
function getDepth() {
    return Depth
}
function validateFormCoices() {
  
    var x = document.forms["selectForm"]["selectedOp"].value;
    if (x == "") {
        return false;
    }
    return true;
}
function readyToSolve() {
    var flagSolved = solvedState();
    if(flagSolved){
        $("#errorInChooseAlgo").text("Solved !");
        $("#errorInChooseAlgo").show();
        return false;
    }
    var flagVald = validateFormCoices();
    if(!flagVald){
        $("#errorInChooseAlgo").text("choose algo");
        $("#errorInChooseAlgo").show();
        return false;
    }
   
    $("#errorInChooseAlgo").hide();
    return true;
}

function solvedState() {
    var count = 1;
    var curState = initial_List(init);
    for(var i=0 ; i<curState.length-1; i++)
        if(count++ !== curState[i])
            return false;

    return true;
}

function stopBtnAlgo() {
    searchMode = false;
    stopClicked = true;
    $("#stopbtn").hide();
    $("#dialogForGame").hide();
    $("#solvebtn").show();
    $.ajax({
        type: 'POST',
        url: 'solution/',
        data: {
            cancelSearch:1,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        }
    }).done(function (data) {  
         
     }
    );
}

function showEnterDepth() {
    $('#depthcontainer').css('visibility', 'visible'); 
    $('#depthcontainer').css('display', 'block');
}
function ckeckIfDLFS() {
    var algo = $("#select-form").val();
    if (algo === 'DLFS') {
        showEnterDepth();
        return true;
    }
    return false;
}

function submitDepth() {
    var d = $("#depth-size").val();
    setDepth(d);
    searchAlgo();
    $('#depthcontainer').css('visibility', 'hidden');
    $('#depthcontainer').css('display', 'none');
   
}

function searchAlgo() {
    stopClicked=false;
    searchMode = true;
    $("#solvebtn").hide();
    $("#stopbtn").show();
    hideStatisticsIfThere();
    period = 550;
    var curState = initial_List(init);
    setProcessedNodesZero();
    getSolution(curState);
}
function getSolution(curState) {
    $.ajax({
        type: 'POST',
        url: 'solution/',
        data: {    
            state: JSON.stringify(curState),
            algorithm: $("#select-form").val(),
            depth: getDepth(),
            cancelSearch:0,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        beforeSend: function () {
            $("#dialogForGame ").css("width", "110px");
            $("#dialogForGame > p").text("Searching!");
            $("#dialogForGame").show().animate({ left: "0px", opacity: 1 }, 900);    
        }
    }).done(function (data) {
        if (data.solution === null) {
            if (getDepth() !== 0) {
                $("#dialogForGame ").css("width", "380px");
                $("#dialogForGame > p").css("font-size", "20px");
                $("#dialogForGame > p").text("Could not find the solution at depth = " + getDepth() + " !");
                $("#stopbtn").hide();
                $("#solvebtn").show();
            }
            // else{ /// null, but not from Depth limited search ! hummm impossible..

            // }
        }
        else {
            $("#dialogForGame > p").text("Done!");
            $("#dialogForGame").fadeOut(950);
            setSolution(data.solution, data.path_cost, data.processed_nodes, data.max_stored, data.time_taken);
        }
    }
    );

}
// to reset processed nodes (in server side) to zero since it is a static 
function setProcessedNodesZero() { 
    $.ajax({
        type: 'POST',
        async: false,
        url: 'setZero/',
        data: {
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        }, 
    }).done(function (data) {
    }
    );
}
var acquireLock = false;
//  Builds the game board by filling the pieces with the current state (either random or custom) with help of "init"
function buildBoard() {
    var size = Number($("#sizeNbox").val());
    var tempid;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
             tempid = [j, i];
            if (init[j + '' + i] === 0) {
                empty = tempid;
                $("#game").append("<div class='piece' id='" + j+""+i + "'><h2 class='numbers'></h2></div>");
            }
            else {
                $("#game").append("<div class='piece' id='" + j+""+i + "'><h2 class='numbers'>" + init[j + '' + i] + "</h2></div>");
            }
    
        }
    }

    $("#game > .piece").css({ width: sizeOfPex + "px" });
    $("#game > .piece").css({ height: sizeOfPex + "px" });
    var tmpGet = "#" + empty.join("");
    $( tmpGet).css({ background: "none" }); /// hide zero  
    $( tmpGet).css("height", "0px");

    $("#game > .piece").mouseenter(function () { 
        $(this).css("cursor", "pointer");
    });

    $("#game > .piece").click(function (event) { /// when clicked on box(number)
        if(!acquireLock){ // critical section! no other boxes can move until the current box finishes
        acquireLock = true;
        hideStatisticsIfThere();
        $("#errorInChooseAlgo").hide();
        if(! solvedState())
            searchMode  =false;
        var id = $(this).attr('id');
        if (getMovables().includes(id)) {
            move(id, "game");
        }
        else{
            acquireLock = false;
        }
    }
    });

}

function hideStatisticsIfThere() {
    $("#statistic").hide();
}

function solvedByUser() {
    if( !searchMode && solvedState() ){
        $("#dialogForGame ").css("width", "110px");
        $("#dialogForGame > p").text("Solved!");
        $("#dialogForGame").show().animate({ left: "0px", opacity: 1 }, 900);    
    }
    else if(!searchMode){
        $("#dialogForGame").hide();
    }
}
// if certain box in the correct position then its color will be changed
function boxInCorrectPosition() {
    var counter =1;
    var size = Number($("#sizeNbox").val());
    for(var i=0; i < size ; i++)
        for(var j=0; j < size ; j++)
            if(counter++ === Number(init[j+""+i]) ){
                $("#"+j+""+i).css({background:"#187777"});
            }
            else{
                $("#"+j+""+i).css({background:"#18b0b0"});
            }
            
}

function move(id, whichBoard) {   
    var coor = [Number(id[0]), Number(id[1])], piece = $("#" + whichBoard + " > #" + id);
    if (empty[0] - coor[0] !== 0) {
        piece.animate({ left: "-=" + (sizeOfPex + 2) * (coor[0] - empty[0]) + "px" }, 200, function () { changeOpacity(id, coor, piece, whichBoard) });
    }
    else if (empty[1] - coor[1] !== 0) {
        piece.animate({ top: "-=" + (sizeOfPex + 2) * (coor[1] - empty[1]) + "px" }, 200, function () { changeOpacity(id, coor, piece, whichBoard) });
    }
}

function changeOpacity(id, coor, piece, whichBoard) {
    /* Changes opacity of the pieces and swaps the ids of the moved pieces. */
    var swapp = init[coor.join("")];
    init[coor.join("")] = 0;
    init[empty.join("")] = swapp;
    var temp = $("#" + whichBoard + " > #" + empty.join("")).attr('id');
    $("#" + whichBoard + " > #" + empty.join("")).attr('id', id);
    piece.attr('id', temp);
    empty = coor;
    zeroID = empty.join("");
    acquireLock = false;
}

var id;
var index;
function shuffle() { /// shuffle the boxes when getting the solution in the search mode 
    if (!(sol_path === undefined) && sol_path.length > 0 && !stopClicked) {
       
        if (sol_path[0] === "RIGHT") {
            index = 1 + Number(zeroID.substr(0, 1)) + "" + zeroID.substr(1);
            zeroID = index;
        }
        else if (sol_path[0] === "LEFT") {
            index = Number(zeroID.substr(0, 1)) - 1 + "" + zeroID.substr(1);
            zeroID = index;
        }
        else if (sol_path[0] === "UP") {
            index = zeroID.substr(0, 1) + "" + (Number(zeroID.substr(1)) - 1);
            zeroID = index;
        }
        else if (sol_path[0] === "DOWN") {
            index = zeroID.substr(0, 1) + "" + (Number(zeroID.substr(1)) + 1);
            zeroID = index;
        }
        id = index;
        sol_path.splice(0, 1);

        move(id, "game");
        setTimeout(function () { shuffle() }, period);
    }
    else { // end of shuffle or stopped?
        if(!stopClicked)
            showStaistics();
        $("#stopbtn").hide();
        $("#solvebtn").show();
        stopClicked = false;
    }
}