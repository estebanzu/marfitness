let timers = {};
let intervals = {};

export async function loadExercises(url) {
    try {
        document.getElementById('loadingIndicator').classList.remove('hidden');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        document.getElementById('loadingIndicator').classList.add('hidden');
        document.getElementById('ownerName').innerText = data.owner;
        createExerciseList(data.exercises);
    } catch (error) {
        document.getElementById('loadingIndicator').classList.add('hidden');
        console.error('Error loading exercises:', error);
    }
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
        title.dataset.index = index;
        title.addEventListener('click', () => toggleElementVisibility(document.getElementById(`exercise_${index}_details`)));

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
                    ${Array.from({ length: exercise.series }).map((_, i) => `
                        <li>
                            <input type="radio" name="series_${index}" id="series_${index}_${i}" onchange="handleSeriesCompletion(${index})">
                            <label for="series_${index}_${i}">Serie ${i + 1}</label>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        exerciseHeader.appendChild(title);
        exerciseDiv.appendChild(exerciseHeader);
        exerciseDiv.appendChild(details);
        exerciseList.appendChild(exerciseDiv);
    });
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

function toggleElementVisibility(element) {
    element.classList.toggle('hidden');
    element.classList.toggle('visible');
}

function handleSeriesCompletion(index) {
    const seriesRadios = document.querySelectorAll(`input[name="series_${index}"]`);
    const allChecked = Array.from(seriesRadios).every(radio => radio.checked);

    if (allChecked) {
        const title = document.getElementById(`exercise_${index}_title`);
        title.style.textDecoration = 'line-through';

        const exerciseDetails = document.getElementById(`exercise_${index}_details`);
        exerciseDetails.classList.add('hidden');
    }

    // Update the progress bar
    const progressbar = document.getElementById(`progressbar_${index}`);
    const completedSteps = Array.from(seriesRadios).filter(radio => radio.checked).length;
    const totalSteps = seriesRadios.length;

    progressbar.style.setProperty('--completed-steps', completedSteps);
    progressbar.style.setProperty('--total-steps', totalSteps);
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
