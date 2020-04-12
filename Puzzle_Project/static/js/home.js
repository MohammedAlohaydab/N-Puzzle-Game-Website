$(function () {

    var CustomState = false;
    // Home screen
    // $("#Home").css("display", "none");
    $(".button").mouseenter(function () {
        $(this).css("cursor", "pointer");
    });

    $(".okbtn").mouseenter(function () {
        $(this).css("cursor", "pointer");
    });
    // Button hover effect
    $(".button").hover(function () {
        $(this).css({ background: "white", color: "black" });
    }, function () {
        $(this).css({ background: "#34495e", color: "#ebebeb" });
    });
    $(".okbtn").hover(function () {
        $(this).css({ background: "white", color: "black" });
    }, function () {
        $(this).css({ background: "#grey", color: "#34495e" });
    });
    $(".okbtn").click(function () {
        $("#dialog").hide();
    });
    var max_chars = 1;
    $('#sizeNbox').keydown(function (e) {
        if ($(this).val().length >= max_chars) {
            $(this).val($(this).val().substr(0, max_chars));
        }
        if ($(this).val() < 2) {
            $(this).val("");
        }
    });

    $('#sizeNbox').keyup(function (e) {
        if ($(this).val().length >= max_chars) {
            $(this).val($(this).val().substr(0, max_chars));
        }
        if ($(this).val() < 2) {
            $(this).val("");
        }
    });

    $("#newGame").click(function(){
       
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
            $("#game-container").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
                $(this).hide();
                window.location="";
        });
     
    });
    function validateForm() {
        var x = document.forms["myForm"]["sizeN"].value;
        if (x == "") {
            $("#dialog").show();
            return false;
        }
        return true;
    }
    function validateFormCoices() {
        var x = document.forms["selectForm"]["selectedOp"].value;
        if (x == "") {

            return false;
        }
        return true;
    }
    $("#sizeN").submit(function (e) {
        e.preventDefault();
        Submit_sizeofN();
    });


    function Submit_sizeofN() {
        if (validateForm()) {
            $("#Home").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
                $(this).hide();
                $("#select-state").show().animate({ left: "0px", opacity: 1 }, 1100);
                // $("#selection-page").show().animate({ left: "0px", opacity: 1 }, 1100);

            });
        }
    }

    $("#Home > .details > .choices > .button").click(function () {
        Submit_sizeofN();
    });

    $("#randombtn").click(function () {

        CustomState = false;
        $("#select-state").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
            $(this).hide();
            $("#selection-page").show().animate({ left: "0px", opacity: 1 }, 1100);

        });
    });

    $("#custombtn").click(function () {
        CustomState = true;
        $("#select-state").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
            $(this).hide();



            $("#chooseBetweenCustom").show().animate({ left: "0px", opacity: 1 }, 1100);

        });
    });

    $("#selection-page > .details > .choices > .button").click(function () {

        if (validateFormCoices()) {
            if (!CustomState) {
                $.ajax({
                    type: 'POST',
                    url: 'generate_state/',
                    data: {
                        size: $("#sizeNbox").val(),
                        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                    },
                    success: function (data) {
                        SaveData(data.state);
                    }
                });
            }
            var algo = $("#select-form").val();
            $("#selection-page").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
                $(this).hide();
                if (algo === 'DLFS') {
                    $("#depth-page").show().animate({ left: "0px" }, 900);
                }
                else {
                    buildBoard();
                    $("#game-container").show().animate({ left: "0px" }, 900);
                    $("#game").show().animate({ left: "0px" }, 900);
                    $("#shuffle").show().animate({ left: "0px", opacity: 1 }, 900);
                }

            });
        }
    });


});
$("#depthForm").submit(function (e) {
    e.preventDefault();
    submtDepth();
});

function submtDepth() {
    var d = $("#depth-size").val();
    setDepth(d);

    $("#depth-page").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
        $(this).hide();
        buildBoard();
        $("#game-container").show().animate({ left: "0px" }, 900);
        $("#game").show().animate({ left: "0px" }, 900);
        $("#shuffle").show().animate({ left: "0px", opacity: 1 }, 900);
    });
}
$("#depthbtn").click(function () {
    submtDepth();
});


$("#manualbtn").click(function (e) {

    var expampleState = "";
    var sizenbox = $("#sizeNbox").val();
    var size = (Number(sizenbox) * Number(sizenbox));
    var i = 1;
    for (i = 1; i < size - 1; i++) {
        expampleState += i + "-";
    }
    expampleState += 0 + "-";
    expampleState += i;

    $("#exampleSameSize").text("e.g : " + expampleState);
    $("#chooseBetweenCustom").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
        $(this).hide();
        $("#show-manual").show().animate({ left: "0px", opacity: 1 }, 900);
    });
});

$("#autobtn").click(function (e) {
    $("#chooseBetweenCustom").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
        $(this).hide();
        buildCustomState();
        $("#customStateContainer").show().animate({ left: "0px", opacity: 1 }, 900);
        $("#customState").show().animate({ left: "0px", opacity: 1 }, 900);
        $("#saving").show().animate({ left: "0px", opacity: 1 }, 900);
    });
});




$("#saveSliding").click(function () {

    var stateList = {};

    $("#customState > .piece").each(function () {
        var id = $(this).attr('id');
        var temp = "#" + id + " > .numbers";

        var value = Number($(temp).text());
        stateList[id] = value;



    });
    var asList = initial_List(stateList);
    isSolvable(asList);
    var tmpflag = getFlag();
    if (!tmpflag) {
        $("#saving").css("display", "none");
        $("#customState").css("display", "none");
        $("#customDsc").text("The state is not solvable ! (you can retry )");
        $("#message-solvable").show().animate({ left: "0px", opacity: 1 }, 1100);
    }
    else {
        SaveDic(stateList);
        $("#customStateContainer").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
            $(this).hide();
            $("#selection-page").show().animate({ left: "0px", opacity: 1 }, 1100);
        });
    }
});
$("#retrySliding").click(function () {
    $("#message-solvable").css("display", "none");
    $("#customDsc").text("Move the Puzzle by clicking on the boxes");
    $("#customState").show().animate({ left: "0px", opacity: 1 }, 1100);
    $("#saving").show().animate({ left: "0px", opacity: 1 }, 1100);

});
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
        if (arr[i] > (stateSize * stateSize - 1))
            return false;

        hash[arr[i]] = true;
    }
    return true;
}


$("#manualSubmit").submit(function (e) {
    e.preventDefault();
    saveManualState();
});
function saveManualState() {
    var text = $("#stateNumbers").val();
    var state = text.split("-").map(Number);
    if (checkTextDash(text) && checkArrayState(state)) {
        isSolvable(state);
        var tmpflag = getFlag();
     
        if (!tmpflag) {
            $("#saveState").css("display", "none");
            $("#exampleSameSize").css("display", "none");
            $("#stateNumbersContainer").css("display", "none");
            $("#firstexplain").text("The state is not solvable ! (you can retry )");
            $("#manualMessage").show().animate({ left: "0px", opacity: 1 }, 1100);
        }
        else {
            SaveData(state);
            $("#show-manual").animate({ left: "-=1000px", opacity: 0 }, 1000, function () {
                $(this).hide();
                $("#selection-page").show().animate({ left: "0px", opacity: 1 }, 1100);
            });
        }
    }
    else { // syntax error!
        $("#saveState").css("display", "none");
        $("#exampleSameSize").css("display", "none");
        $("#stateNumbersContainer").css("display", "none");
        $("#firstexplain").text("Syntax error please check the example ! (you can retry )");
        $("#manualMessage").show().animate({ left: "0px", opacity: 1 }, 1100);
    }
}

$("#saveState").click(function () {
    saveManualState();

});
$("#retryManual").click(function () {
    $("#manualMessage").css("display", "none");
    $("#firstexplain").text("Enter game state, from top-left to right-bottom (do not forget '-' between numbers)");
    $("#exampleSameSize").show().animate({ left: "0px", opacity: 1 }, 1100);
    $("#stateNumbersContainer").show().animate({ left: "0px", opacity: 1 }, 1100);
    $("#saveState").show().animate({ left: "0px", opacity: 1 }, 1100);
});

function getMovables() {
    /* Returns currently movable pieces */

    var movables = [];
    $(".piece").each(function () {
        var id = $(this).attr('id');
        var coor = [Number(id[0]), Number(id[1])];

        if (Math.abs(empty[0] - coor[0]) + Math.abs(empty[1] - coor[1]) === 1)
            movables.push(id);
    });
    return movables;
}




//         GAMMMMMME !



var empty = [];
var tempState = [];
// var tempState = [1,2,3,4,
//                 5,6,7,8,
//                 0,10,11,12,
//                 9,13,14,15
//                 ];
var state_size;
var sizeOfPex;
var period;
var sol_path = [];
var zeroID;
var flag;
var pathCost;
var maxStoredNodes;
var numProcessedNodes;
var timeTaken;
function setFlag(f) {
    flag = f;
}
function getFlag() {
    return flag;
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
            setFlag(data.flag);
        }
    });


}


function buildCustomState() {

    var size = Number($("#sizeNbox").val());
    var counter = 1;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var tempid = [j, i];
            if (counter === (size * size))
                counter = 0;
            if (counter === 0) {
                empty = tempid;
                $("#customState").append("<div class='piece' id='" + tempid.join("") + "'style=font-size:" + (((0.5 / size) * 150)) + "px'" + "><h2 class=numbers></h2></div>");
            }
            else {
                $("#customState").append("<div class='piece' id='" + tempid.join("") + "'style=font-size:" + (((0.5 / size) * 150)) + "px'" + "><h2 class=numbers>" + counter + "</h2></div>");
            }
            counter++;
        }
    }

    sizeOfPex = (0.5 / size) * 1000;
    // dynamic css     do not forget font size 
    $("#customState").css({ width: ((size * sizeOfPex) + (size * 2)) + "px" });

    $("#customState").css({ padding: 3 });

    $("#customState > .piece").css({ width: sizeOfPex + "px" });
    $("#customState > .piece").css({ height: sizeOfPex + "px" });



    var tmpGet = "#" + empty.join("");
    $("#customState > " + tmpGet).css("width", "0px");
    $("#customState > " + tmpGet).css("height", "0px");

    $("#customState > .piece").mouseenter(function () {
        $(this).css("cursor", "pointer");
    });



    $("#customState > .piece").click(function (event) {
        var id = $(this).attr('id');
        if (getMovables().includes(id)) {
            move(id, "customState");
        }
    });




}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
function SaveData(state) {
    tempState = state;
    state_size = Number(Math.sqrt(tempState.length));
    sizeOfPex = (0.5 / state_size) * 1000;
    init = initial_state(state_size);
    zeroID = getKeyByValue(init, 0);

}

function SaveDic(stateDic) {
    init = stateDic;
    state_size = Number($("#sizeNbox").val());

    sizeOfPex = (0.5 / state_size) * 1000;
    zeroID = getKeyByValue(init, 0);

    tempState = initial_List(init);
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
   
    $("#firstp").text("Time taken = " + timeTaken);
    $("#secondp").text("Path cost = " + pathCost);
    $("#thirdp").text(" Processed nodes = " + numProcessedNodes);
    $("#forthp").text(" Maximum number of nodes = " + maxStoredNodes);
    $("#statistic").show().animate({ left: "0px" }, 900);
}

function initial_List(dic) {
    var lst = [];
    var count = 0;
    for (var i = 0; i < state_size; i++)
        for (var j = 0; j < state_size; j++) {
            if (dic[j + "" + i] === 0)
                empty = [j, i];

            lst[count++] = dic[j + "" + i];
        }
    return lst;
}

function initial_state(size) {
    var stateCounter = 0;
    var init = {};
    for (var i = 0; i < size; i++)
        for (var j = 0; j < size; j++) {
            if (tempState[stateCounter] === 0)
                empty = [j, i];

            init["" + j + "" + i + ""] = tempState[stateCounter++];
        }
    return init;

}





// $(".button").mouseenter(function () {
// $(this).css("cursor", "pointer");
// });

// // Button hover effect
// $(".button").hover(function () {
//     $(this).css({ background: "white", color: "black" });
// }, function () {
//     $(this).css({ background: "#34495e", color: "#ebebeb" });
// });

var Depth = 0;
function setDepth(d) {
    Depth = d;
}
function getDepth() {
    return Depth
}

$("#startShuffle").click(function () {
    period = 720;
    $("#shuffle").css('display', 'none');

    $.ajax({
        type: 'POST',
        async: false,
        url: 'solution/',
        data: {
           
            state: JSON.stringify(tempState),
            algorithm: $("#select-form").val(),
            depth: Depth,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        beforeSend: function () {
            $("#dialogForGame").show();

        }
    }).done(function (data) {

        if (data.solution === null) {
            if (getDepth() !== 0) {
                $("#dialogForGame ").css("width", "370px");
                $("#dialogForGame > p").css("font-size", "20px");
                $("#dialogForGame > p").text("Could not find the solution at depth = " + getDepth() + " !");
                $("game").css("margin-top", "3px");
                $("#newGameContainer").show().animate({ left: "0px", opacity: 1 }, 900);
                $("#newGame").show().animate({ left: "0px", opacity: 1 }, 900);
            }
            // else{ /// null but not from Depth limited search !

            // }
        }
        else {

            $("#dialogForGame > p").text("Done!");
            $("#dialogForGame").fadeOut(2000);
          
            setSolution(data.solution, data.path_cost, data.processed_nodes, data.max_stored, data.time_taken);

        }
        
      
    }
    );

});
function buildBoard() {
    /* Builds the game board by filling the pieces */

    for (var i = 0; i < state_size; i++) {
        for (var j = 0; j < state_size; j++) {
            var tempid = [j, i];
            if (init[j + "" + i] === 0) {

                $("#game").append("<div class='piece' id='" + tempid.join("") + "'style=font-size:" + ((0.5 / state_size) * 150) + "px'" + "><h2 class=numbers></h2></div>")

            }
            else {

                $("#game").append("<div class='piece' id='" + tempid.join("") + "'style=font-size:" + ((0.5 / state_size) * 150) + "px'" + "><h2 class=numbers>" + init[j + '' + i] + "</h2></div>")
            }
        }
    }



    // dynamic css     do not forget font size 
    $("#game").css({ width: ((state_size * sizeOfPex) + (state_size * 2)) + "px" });

    $("#game").css({ padding: 3 });

    $("#game > .piece").css({ width: sizeOfPex + "px" });
    $("#game > .piece").css({ height: sizeOfPex + "px" });


    var tmpGet = "#" + empty.join("");
    // $("#game > "+tmpGet).css("width","0px");
    // $("#game > "+tmpGet).css("height","0px");
    $("#game > " + tmpGet).css({ background: "none" });

}

function move(id, whichBoard) {
    /* Moves the piece with the given id. */

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
    var temp = $("#" + whichBoard + " > #" + empty.join("")).attr('id');
    $("#" + whichBoard + " > #" + empty.join("")).attr('id', id);
    piece.attr('id', temp);
    empty = coor;
}

function checkForWin() {
    /* Checks if all pieces are aligned in increasing order, 
    i.e if the puzze is solved. */

    var next = 0, id, flag = true;
    $("#game").children().each(function (i, item) {
        id = $(item).attr('id');
        if (next !== init[id])
            flag = false;
        next++;
    })
}



var id;
var index;
function shuffle() {
    /* Shuffles the pieces */

    if (!(sol_path === undefined) && sol_path.length > 0) {

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
    else {
        $("game").css("margin-top", "3px");
        showStaistics();
        $("#newGameContainer").show().animate({ left: "0px", opacity: 1 }, 900);
        $("#newGame").show().animate({ left: "0px", opacity: 1 }, 900);
    }
}