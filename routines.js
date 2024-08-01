let timers = {};
let intervals = {};

export function loadExercises(url) {
    document.getElementById('loadingIndicator').classList.remove('hidden');
    return fetch(url)
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

export function createExerciseList(exercises) {
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
                    Series: ${exercise.series} <br> Repeats: ${exercise.repeats} <br>  Rest: ${exercise.rest} seconds <br>  Weight: ${exercise.weight} kg <br>
                    <a href="${exercise.video}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="Watch Video" class="video-icon"></a>
                </div>
            </div>
        `;

        exerciseHeader.appendChild(title);
        exerciseDiv.appendChild(exerciseHeader);
        exerciseDiv.appendChild(details);
        exerciseList.appendChild(exerciseDiv);
    });
}

function toggleExercise(index) {
    const exerciseDetails = document.getElementById(`exercise_${index}_details`);
    exerciseDetails.classList.toggle('hidden');
    checkAllExercises();
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

export function startPauseTimer(index, duration) {
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

export function restartTimer(index, duration) {
    clearInterval(intervals[index]);
    intervals[index] = null;
    timers[index] = duration;
    startPauseTimer(index, duration);
}
