function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

function calculateExperience(startYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
}

document.addEventListener('DOMContentLoaded', function () {
    const age = calculateAge('2004-11-24');
    const ageElement = document.getElementById('age');
    if (ageElement) ageElement.textContent = age;

    const experience = calculateExperience(2019);
    const expElement = document.getElementById('experience');
    if (expElement) expElement.textContent = experience;

    const yearElement = document.getElementById('year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const formStatus = document.getElementById('formStatus');

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';

        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = 'Thanks for your message! I\'ll get back to you soon.';
                formStatus.classList.add('success');
                this.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formStatus.textContent = 'Oops! There was a problem. Please try again.';
            formStatus.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}