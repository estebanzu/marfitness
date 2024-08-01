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

async function loadRoutinesModule(routineUrl) {
    try {
        const module = await import('./routines.js');
        module.loadExercises(routineUrl);
        window.startPauseTimer = module.startPauseTimer;
        window.restartTimer = module.restartTimer;
    } catch (error) {
        console.error('Error loading routines module:', error);
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

    submitRoutine();
}

function toggleElementVisibility(element) {
    element.classList.toggle('hidden');
    element.classList.toggle('visible');
}
