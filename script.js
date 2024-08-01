document.addEventListener('DOMContentLoaded', () => {
    const routine1Checkbox = document.getElementById('routine1');
    const routine2Checkbox = document.getElementById('routine2');

    routine1Checkbox.addEventListener('change', () => handleRoutineSelection('routine1'));
    routine2Checkbox.addEventListener('change', () => handleRoutineSelection('routine2'));

    document.querySelector('button').addEventListener('click', submitRoutine);
});

const ownerName = "Marcia Calderon Campos";
const routine1Url = "https://raw.githubusercontent.com/estebanzu/marfitness/main/routine1.json";
const routine2Url = "https://raw.githubusercontent.com/estebanzu/marfitness/main/routine2.json";

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
    } else {
        intervals[index] = setInterval(() => {
            const minutes = parseInt(timers[index] / 60, 10);
            const seconds = parseInt(timers[index] % 60, 10);

            timerElement.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

            if (--timers[index] < 0) {
                clearInterval(intervals[index]);
                intervals[index] = null;
                timerElement.textContent = "Rest Over";
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
        details.innerHTML = `Series: ${exercise.series} | Repeats: ${exercise.repeats} | Rest: ${exercise.rest} seconds | Weight: ${exercise.weight} kg
                             <button onclick="startPauseTimer(${index}, ${exercise.rest})">Start/Pause</button>
                             <button class="restart-button" onclick="restartTimer(${index}, ${exercise.rest})">Restart</button>
                             <span id="timer_${index}"></span><br><a href="${exercise.video}" target="_blank">Watch Video</a>`;

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

function loadExercises(githubUrl) {
    fetch(githubUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('ownerName').innerText = data.owner;
            createExerciseList(data.exercises);
        })
        .catch(error => console.error('Error loading exercises:', error));
}

function submitRoutine() {
    const routine1Checkbox = document.getElementById('routine1');
    const routine2Checkbox = document.getElementById('routine2');

    if (routine1Checkbox.checked) {
        loadExercises(routine1Url);
    } else if (routine2Checkbox.checked) {
        loadExercises(routine2Url);
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
