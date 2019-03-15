// $(document).ready(function () {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDBiWBsdWUswrH64wByEimVA9tOWqA2KZU",
    authDomain: "trainscheduler-3cf73.firebaseapp.com",
    databaseURL: "https://trainscheduler-3cf73.firebaseio.com",
    projectId: "trainscheduler-3cf73",
    storageBucket: "trainscheduler-3cf73.appspot.com",
    messagingSenderId: "95103626532"
};

firebase.initializeApp(config);

// A variable to reference the database.
let database = firebase.database();

// variables for onclick
let trainName;
let originCity;
let destinationCity;
let firstTrain;
let frequency;

// set listener on submit button to gather values from each field
$("#add-train").on("submit", function (event) { //id on form listens to the form, and on click of type of submit on button  
    event.preventDefault();
    trainName = $("#name-train").val().trim();
    console.log("Train Input: " + trainName);
    originCity = $("#origin-city").val();
    console.log("Origin: " + originCity);
    destinationCity = $("#destination-city").val();
    console.log("Destination: " + destinationCity);
    firstTrain = $("#first-train-time").val();
    console.log("First Train: " + firstTrain);
    frequency = $("#frequency").val().trim();
    console.log("Frequency: " + frequency);

    // localStorage.clear(); // does this need to be here for local storage only or also firebase
    // localStorage.setItem("trainName", trainName); //this needed for firebase ? or only for local

    database.ref().push({
        trainName: trainName,
        originCity: originCity,
        destinationCity: destinationCity,
        firstTrain: firstTrain,
        frequency: frequency,
        // dateAdded: firebase.databse.ServerValue.TIMESTAMP,
        //     

    });

    $("#add-train")[0].reset();

});


// or use .on("child_added")
database.ref().on("value", function (snapshot) {
    $("#add-train-info").empty();
    // console.log(snapshot);
    snapshot.forEach(function (data) { //data becomes each train as the parameter
        // console.log(data.val());
        // getting firstTrain data
        let firstTrain = data.val().firstTrain
        // converting firstTrain into new variable to then manipulate into AM PM format on DOM
        let firstTrainAMPM = moment(firstTrain, "hh:mm").subtract(1, "years");
        console.log("FIRST TRAIN TIME: " + moment(firstTrainAMPM).format("HH:mm A"));
        // converting firstTrain time to then do calculations on next train and next arrival time
        let firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        console.log("CONVERTED: " + firstTrainConverted);
        // getting current time
        let currentTime = moment();
        // converting currentTime
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        // calculating difference between current time and firstTrainCovnerted
        let diffTime = moment().diff(moment(firstTrainConverted), "minutes");
        console.log("DIFFERENCE: " + diffTime);
        // getting val of frequency
        let frequency = data.val().frequency
        console.log("FREQUENCY: " + frequency);

        let tRemainder = diffTime % frequency;

        console.log("REMAINDER: " + tRemainder);

        let minutesAway = frequency - tRemainder;

        console.log("MINUTES AWAY: " + minutesAway);

        let nextTrain = moment().add(minutesAway, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));;

        var newRow =
            `<tr>
        <td>${data.val().trainName}</td>
        <td>${data.val().originCity}</td>
        <td>${data.val().destinationCity}</td>
        <td>${moment(firstTrainAMPM).format("hh:mm A")}</td>
        <td>${data.val().frequency}</td>
        <td>${moment(nextTrain).format("hh:mm A")}</td>
        <td>${minutesAway}</td>
            </tr>`
        // console.log(newRow);

        $("#add-train-info").append(newRow);

    });

});
