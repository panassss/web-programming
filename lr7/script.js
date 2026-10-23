const ourCoords = {
    latitude: 48.94321,
    longitude: 24.73380
};

let watchId = null;

document.addEventListener('DOMContentLoaded', getMyLocation);

function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation, displayError);

        const watchButton = document.getElementById("watch");
        watchButton.onclick = watchLocation;

        const clearWatchButton = document.getElementById("clearWatch");
        clearWatchButton.onclick = clearWatch;
    } else {
        alert("Oops, no geolocation support");
    }
}

function displayLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    const div = document.getElementById("location");
    div.innerHTML = `You are at Latitude: ${latitude}, Longitude: ${longitude} (with ${accuracy} meters accuracy)`;

    const km = computeDistance(position.coords, ourCoords);
    const distanceDiv = document.getElementById("distance");
    distanceDiv.innerHTML = `You are ${km.toFixed(2)} km from the College`;
}

function displayError(error) {
    const errorTypes = {
        0: "Unknown error",
        1: "Permission denied by user",
        2: "Position is not available",
        3: "Request timed out"
    };

    let errorMessage = errorTypes[error.code];
    if (error.code === 0 || error.code === 2) {
        errorMessage = errorMessage + ": " + error.message;
    }

    const div = document.getElementById("location");
    div.innerHTML = errorMessage;
}

function computeDistance(startCoords, destCoords) {
    const startLatRads = degreesToRadians(startCoords.latitude);
    const startLongRads = degreesToRadians(startCoords.longitude);
    const destLatRads = degreesToRadians(destCoords.latitude);
    const destLongRads = degreesToRadians(destCoords.longitude);
    const Radius = 6371;

    const distance = Math.acos(
        Math.sin(startLatRads) * Math.sin(destLatRads) +
        Math.cos(startLatRads) * Math.cos(destLatRads) *
        Math.cos(startLongRads - destLongRads)
    ) * Radius;

    return distance;
}

function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

function watchLocation() {
    if (watchId === null) {
        watchId = navigator.geolocation.watchPosition(displayLocation, displayError);
    }
}

function clearWatch() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}