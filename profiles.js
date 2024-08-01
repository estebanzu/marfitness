export function loadProfiles() {
    return fetch('profiles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function populateProfileSelect(profiles) {
    const profileSelect = document.getElementById('profileSelect');
    profileSelect.innerHTML = ''; // Clear existing options
    profiles.forEach(profile => {
        const option = document.createElement('option');
        option.value = profile.id;
        option.text = profile.name;
        profileSelect.add(option);
    });
}
