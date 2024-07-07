document.addEventListener("DOMContentLoaded", () => {
    // Intersection Observer for .hidden and .logos-section elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    });

    // Observe hidden elements
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Observe logos section elements
    const logosSection = document.querySelector('.logos-section');
    if (logosSection) observer.observe(logosSection);

    // Initialize VanillaTilt for logos
    VanillaTilt.init(document.querySelectorAll('.logos-box'), {
        max: 35,          // Max tilt angle
        speed: 500,       // Speed of the tilt effect
        glare: true,      // Enable glare effect
        "max-glare": 0.5, // Intensity of the glare effect
        reverse: true,    // Reverse the tilt effect direction
        scale: 1.1,       // Scale up the element slightly
        reset: true       // Reset tilt on mouse out
    });

    // Add click event listeners to logos to toggle text boxes
    const logosBoxes = document.querySelectorAll('.logos-box');
    logosBoxes.forEach((box, index) => {
        box.addEventListener('click', () => {
            const textBox = document.querySelector('.generated-text-box');

            // Check if the text box already exists and is related to the clicked icon
            if (textBox && textBox.dataset.iconIndex === `${index}`) {
                textBox.remove(); // Remove the text box if it's from the same icon
            } else {
                // Remove any existing text boxes
                const existingBox = document.querySelector('.generated-text-box');
                if (existingBox) {
                    existingBox.remove();
                }
                // Create and display a new text box with specific content
                const contentHTML = getTextBoxContent(index);
                generateTextBox(box, contentHTML, index);
            }
        });
    });

    // Close text box when scrolling from specific sections
    const closeTextBoxOnScroll = () => {
        const helloWorld = document.querySelector('#first-title');
        const theFirstResidence = document.querySelector('#first-paragraph');
        const textBox = document.querySelector('.generated-text-box');

        if (textBox) {
            const helloWorldRect = helloWorld.getBoundingClientRect();
            const theFirstResidenceRect = theFirstResidence.getBoundingClientRect();

            if (
                (window.scrollY > helloWorldRect.bottom && window.scrollY < theFirstResidenceRect.top) ||
                (window.scrollY > theFirstResidenceRect.bottom)
            ) {
                textBox.remove(); // Close the text box when scrolling past the sections
            }
        }
    };

    // Add scroll event listener to close text box
    window.addEventListener('scroll', closeTextBoxOnScroll);
});

// Function to generate text box
function generateTextBox(targetElement, innerHTML, index) {
    // Create the text box
    const textBox = document.createElement('div');
    textBox.className = 'generated-text-box';
    textBox.innerHTML = innerHTML; // Use innerHTML for rich content
    textBox.dataset.iconIndex = `${index}`; // Store the icon index in a data attribute

    // Append the text box to the body
    document.body.appendChild(textBox);

    // Position the text box
    const targetRect = targetElement.getBoundingClientRect();
    textBox.style.top = `${targetRect.bottom + window.scrollY}px`;
    textBox.style.left = `${targetRect.left + window.scrollX + targetRect.width / 2}px`;
    textBox.style.transform = 'translateX(-50%)';

    // Add a fade-in animation
    textBox.style.opacity = '0';
    textBox.style.transition = 'opacity 0.3s ease-in-out';
    requestAnimationFrame(() => {
        textBox.style.opacity = '1';
    });
}

// Function to get content based on the icon index
function getTextBoxContent(index) {
    const texts = [
        `<p><strong>CCTV</strong></p>
        <p>CCTV on security drone helps with security by offering live video from the air. It allows for real-time surveillance, detects intrusions, supports quick responses, and captures evidence. Drones can patrol large or hard-to-reach areas, manage crowds, and inspect facilities effectively.</p>`,
        `<p><strong>Server</strong></p>
        <p>The server in a security drone system processes and stores data from the drone’s cameras. It manages video feeds, handles real-time analysis, and ensures secure storage and backup of footage. The server also supports remote access for monitoring and control through applications.</p>`,
        `<p><strong>Application</strong></p>
        <p>The connection between the guard and residents via the application allows residents to report issues, receive updates, and communicate with the guard for safety and information.</p>`,
        `<p><strong>Navigation</strong></p>
        <p>The navigation of a security drone around the park involves using GPS for precise positioning, automated flight paths for coverage, and obstacle avoidance to ensure safe and efficient patrols.</p>`
    ];
    return texts[index] || `<p><strong>Information for Icon ${index + 1}</strong></p>
        <p>This is some detailed information for the selected icon.</p>`;
}
