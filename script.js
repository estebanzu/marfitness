document.addEventListener('DOMContentLoaded', () => {
    const routine1Checkbox = document.getElementById('routine1');
    const routine2Checkbox = document.getElementById('routine2');
    const profileSelect = document.getElementById('profileSelect');

    routine1Checkbox.addEventListener('change', () => handleRoutineSelection('routine1'));
    routine2Checkbox.addEventListener('change', () => handleRoutineSelection('routine2'));
    profileSelect.addEventListener('change', submitRoutine);

    document.querySelector('button').addEventListener('click', submitRoutine);

    loadProfiles();
});

let profiles = {};

function loadProfiles() {
    fetch('profiles.json')
        .then(response => response.json())
        .then(data => {
            profiles = data;
            populateProfileSelect();
        })
        .catch(error => console.error('Error loading profiles:', error));
}

function populateProfileSelect() {
    const profileSelect = document.getElementById('profileSelect');
    profileSelect.innerHTML = ''; // Clear existing options
    profiles.forEach(profile => {
        const option = document.createElement('option');
        option.value = profile.id;
        option.text = profile.name;
        profileSelect.add(option);
    });
}

function toggleExercise(index) {
    const checkbox = document.getElementById(`exercise_${index}`);
    const exerciseTitle = document.getElementById(`exercise_${index}_title`);
    const exerciseDetails = document.getElementById(`exercise_${index}_details`);
    const isChecked = checkbox.checked;

    if (isChecked) {
        exerciseTitle.classList.add('strikethrough');
        exerciseDetails.classList.add('hidden');
    } else {
        exerciseTitle.classList.remove('strikethrough');
        exerciseDetails.classList.remove('hidden');
    }
    checkAllExercises();
}

let timers = {};
let intervals = {};

function startPauseTimer(index, duration) {
    const timerElement = document.getElementById(`timer_${index}`);

    if (!timers[index]) {
        timers[index] = duration;
    }

    if (intervals[index]) {
        clearInterval(intervals[index]);
        intervals[index] = null;
        timerElement.classList.remove('enabled');
    } else {
        timerElement.classList.add('enabled');
        intervals[index] = setInterval(() => {
            const minutes = parseInt(timers[index] / 60, 10);
            const seconds = parseInt(timers[index] % 60, 10);

            timerElement.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

            if (--timers[index] < 0) {
                clearInterval(intervals[index]);
                intervals[index] = null;
                timerElement.textContent = "Rest Over";
                timerElement.classList.remove('enabled');
            }
        }, 1000);
    }
}


function restartTimer(index, duration) {
    clearInterval(intervals[index]);
    intervals[index] = null;
    timers[index] = duration;
    startPauseTimer(index, duration);
}

function createExerciseList(exercises) {
    const exerciseList = document.getElementById('exerciseList');
    exerciseList.innerHTML = '';  // Clear existing list
    exercises.forEach((exercise, index) => {
        const exerciseDiv = document.createElement('div');
        exerciseDiv.className = 'exercise';
        exerciseDiv.id = `exercise_${index}_div`;

        const exerciseHeader = document.createElement('div');
        exerciseHeader.className = 'exercise-header';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `exercise_${index}`;
        checkbox.addEventListener('click', () => toggleExercise(index));

        const title = document.createElement('div');
        title.className = 'exercise-title';
        title.id = `exercise_${index}_title`;
        title.innerText = exercise.name;

        const details = document.createElement('div');
        details.className = 'exercise-details';
        details.id = `exercise_${index}_details`;
        details.innerHTML = `Series: ${exercise.series} | Repeats: ${exercise.repeats} | Rest: ${exercise.rest} seconds | Weight: ${exercise.weight} kg <br> <hr>
                             <button onclick="startPauseTimer(${index}, ${exercise.rest})">
                                 <img src="https://cdn-icons-png.flaticon.com/512/27/27185.png" alt="Start/Pause" class="button-icon"> Start/Pause
                             </button>
                             <button class="restart-button" onclick="restartTimer(${index}, ${exercise.rest})">
                                 <img src="https://static-00.iconduck.com/assets.00/reboot-icon-2029x2048-gq6tomyw.png" alt="Restart" class="button-icon"> Restart
                             </button> <br>
                             <center><b><span id="timer_${index}" class="timer"></span></b></center> <br><hr><br><center> <a href="${exercise.video}" target="_blank">Watch Video</a></center>`;

        exerciseHeader.appendChild(checkbox);
        exerciseHeader.appendChild(title);
        exerciseDiv.appendChild(exerciseHeader);
        exerciseDiv.appendChild(details);
        exerciseList.appendChild(exerciseDiv);
    });
}

function checkAllExercises() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    const message = document.getElementById('congratulationsMessage');

    if (allChecked) {
        message.classList.remove('hidden');
    } else {
        message.classList.add('hidden');
    }
}

function loadExercises(url) {
    document.getElementById('loadingIndicator').classList.remove('hidden');
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loadingIndicator').classList.add('hidden');
            document.getElementById('ownerName').innerText = data.owner;
            createExerciseList(data.exercises);
        })
        .catch(error => {
            document.getElementById('loadingIndicator').classList.add('hidden');
            console.error('Error loading exercises:', error);
        });
}

function submitRoutine() {
    const routine1Checkbox = document.getElementById('routine1');
    const routine2Checkbox = document.getElementById('routine2');
    const selectedProfileId = document.getElementById('profileSelect').value;
    const selectedProfile = profiles.find(profile => profile.id === selectedProfileId);

    if (routine1Checkbox.checked) {
        loadExercises(selectedProfile.routine1Url);
    } else if (routine2Checkbox.checked) {
        loadExercises(selectedProfile.routine2Url);
    } else {
        alert("Please select a routine.");
    }
}

function handleRoutineSelection(routine) {
    const routine1Checkbox = document.getElementById('routine1');
    const routine2Checkbox = document.getElementById('routine2');

    if (routine === 'routine1') {
        routine2Checkbox.checked = false;
    } else {
        routine1Checkbox.checked = false;
    }
}
