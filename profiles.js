export async function loadProfiles() {
    try {
        const response = await fetch('profiles.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading profiles:', error);
    }
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
