document.addEventListener('DOMContentLoaded', () => {
    const routine1Checkbox = document.getElementById('routine1');
    const routine2Checkbox = document.getElementById('routine2');
    const profileSelect = document.getElementById('profileSelect');

    routine1Checkbox.addEventListener('change', () => handleRoutineSelection('routine1'));
    routine2Checkbox.addEventListener('change', () => handleRoutineSelection('routine2'));
    profileSelect.addEventListener('change', submitRoutine);

    loadProfilesModule().then(submitRoutine);  // Ensure profiles are loaded before calling submitRoutine
});

async function loadProfilesModule() {
    try {
        const module = await import('./profiles.js');
        const profiles = await module.loadProfiles();
        window.profiles = profiles;
        module.populateProfileSelect(profiles);
    } catch (error) {
        console.error('Error loading profiles module:', error);
    }
}

function submitRoutine() {
    const routine1Checkbox = document.getElementById('routine1');
    const routine2Checkbox = document.getElementById('routine2');
    const selectedProfileId = document.getElementById('profileSelect').value;

    if (!window.profiles) {
        console.error('Profiles not loaded yet.');
        return;
    }

    const selectedProfile = window.profiles.find(profile => profile.id === selectedProfileId);

    if (routine1Checkbox.checked) {
        loadRoutinesModule(selectedProfile.routine1Url);
    } else if (routine2Checkbox.checked) {
        loadRoutinesModule(selectedProfile.routine2Url);
    } else {
        alert("Please select a routine.");
    }
}

function loadRoutinesModule(routineUrl) {
    import('./routines.js')
        .then(module => {
            module.loadExercises(routineUrl);
            window.startPauseTimer = module.startPauseTimer;
            window.restartTimer = module.restartTimer;
        })
        .catch(error => console.error('Error loading routines module:', error));
}

function handleRoutineSelection(routine) {
    const routine1Checkbox = document.getElementById('routine1');
    const routine2Checkbox = document.getElementById('routine2');

    if (routine === 'routine1') {
        routine2Checkbox.checked = false;
    } else {
        routine1Checkbox.checked = false;
    }

    submitRoutine();
}

function toggleExercise(index) {
    const allExerciseDetails = document.querySelectorAll('.exercise-details');
    allExerciseDetails.forEach((details, idx) => {
        if (idx !== index) {
            details.classList.add('hidden');
        }
    });

    const exerciseDetails = document.getElementById(`exercise_${index}_details`);
    exerciseDetails.classList.toggle('hidden');
    checkAllExercises();
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

        const title = document.createElement('div');
        title.className = 'exercise-title-button';
        title.id = `exercise_${index}_title`;
        title.innerText = exercise.name;
        title.addEventListener('click', () => toggleExercise(index));

        const details = document.createElement('div');
        details.className = 'exercise-details hidden';
        details.id = `exercise_${index}_details`;
        details.innerHTML = `
            <div class="exercise-details-container">
                <div class="left-column">
                    <button onclick="startPauseTimer(${index}, ${exercise.rest})">
                        <img src="https://cdn-icons-png.flaticon.com/512/27/27185.png" alt="Start/Pause" class="button-icon"> Start/Pause
                    </button>
                    <button class="restart-button" onclick="restartTimer(${index}, ${exercise.rest})">
                        <img src="https://static-00.iconduck.com/assets.00/reboot-icon-2029x2048-gq6tomyw.png" alt="Restart" class="button-icon"> Restart
                    </button>
                    <div><b><span id="timer_${index}" class="timer"></span></b></div>
                </div>
                <div class="right-column">
                    Series: ${exercise.series} <br> Repeats: ${exercise.repeats} <br> Rest: ${exercise.rest} seconds <br> Weight: ${exercise.weight} kg <br>
                    <a href="${exercise.video}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="Watch Video" class="video-icon"></a>
                </div>
            </div>
            <div class="progress-container">
                <ul class="progressbar" id="progressbar_${index}">
                    ${Array.from({ length: exercise.series }).map((_, i) => `<li id="step_${index}_${i}">Step ${i + 1}</li>`).join('')}
                </ul>
            </div>
        `;

        exerciseHeader.appendChild(title);
        exerciseDiv.appendChild(exerciseHeader);
        exerciseDiv.appendChild(details);
        exerciseList.appendChild(exerciseDiv);
    });
}

function handleSeriesCompletion(index) {
    const seriesSteps = document.querySelectorAll(`#progressbar_${index} li`);
    const allChecked = Array.from(seriesSteps).every(step => step.classList.contains('active'));

    if (allChecked) {
        const title = document.getElementById(`exercise_${index}_title`);
        title.style.textDecoration = 'line-through';

        const exerciseDetails = document.getElementById(`exercise_${index}_details`);
        exerciseDetails.classList.add('hidden');
    }
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

window.submitRoutine = submitRoutine;
