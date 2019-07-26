// ===== FIREBASE CONFIG =====
var firebaseConfig = {
    apiKey: "AIzaSyAn4WC-A3VKbyjRMIIJZdMXditFPlXPqYI",
    authDomain: "train-class.firebaseapp.com",
    databaseURL: "https://train-class.firebaseio.com",
    projectId: "train-class",
    storageBucket: "",
    messagingSenderId: "392413794475",
    appId: "1:392413794475:web:edff0babe145c13f"
};
// ===== Initialize Firebase =====
firebase.initializeApp(firebaseConfig);

// ===== Variable for database reference =====
var database = firebase.database();

// ===== Global Variables =====
var name;
var destination;
var firstTrainTime;
var frequency = 0;

// ===== CLICK HANDLER FOR SUBMIT BUTTON =====
$("#submit-button").on("click", function() {

    event.preventDefault();
    // ===== Getting data from the user's input =====
    name = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrainTime = $("#train-time-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    // ===== Console logging the user's inputs ===== 
    console.log(name);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    // ===== Pushing the data to the database =====
    database.ref().push( {
        name: name,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
    })
    $("form")[0].reset();
})

database.ref().on("child_added", function(snapshot) {

    // ===== Changing the first train time to reflect before current time =====
    var trainTime = moment(snapshot.val().firstTrainTime, "HH:mm").subtract(1, "days");
    // ===== Difference between current time and firstTrainTime =====
    var difference = moment().diff(moment(trainTime), "minutes");
    var remainder = difference % snapshot.val().frequency;
    // ===== Minutes until the next train =====
    var minutesAway = snapshot.val().frequency - remainder;
    // ===== Next train arrival =====
    var nextTrain = moment().add(minutesAway, "minutes");
    // ===== Formatting the time =====
    nextTrain = moment(nextTrain).format("h:mm A");

    // ===== APPENDING THE DATA TO THE TABLE =====
    $("#add-train-info").append("<tr><td>" + snapshot.val().name +
        "</td><td>" + snapshot.val().destination +
        "</td><td>" + snapshot.val().frequency +
        "</td><td>" + nextTrain +
        "</td><td>" + minutesAway + "</td></tr>");

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
})




