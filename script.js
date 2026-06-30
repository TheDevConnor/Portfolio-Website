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

const blogList = document.getElementById('blogList');

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderBlogPosts(posts) {
    if (!blogList) return;

    if (!posts || posts.length === 0) {
        blogList.innerHTML = '<p class="blog-empty">No posts yet. Coming soon!</p>';
        return;
    }

    blogList.innerHTML = posts.map(post => `
        <div class="blog-card" data-id="${post.id}">
            <div class="blog-card-header">
                <h3 class="blog-card-title">${post.title}</h3>
                <span class="blog-card-date">${formatDate(post.date)}</span>
            </div>
            <p class="blog-card-excerpt">${post.excerpt}</p>
            <div class="blog-card-tags">
                ${post.tags.map(tag => `<span class="blog-card-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');

    blogList.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', () => openBlogPost(parseInt(card.dataset.id), posts));
    });
}

function parseMarkdown(md, basePath) {
    const renderer = new marked.Renderer();
    renderer.image = ({ href, title, text }) => {
        let src = href;
        if (!src.startsWith('http') && !src.startsWith('/')) {
            src = basePath + src;
        }
        const attrs = `src="${src}" alt="${text || ''}"`;
        if (title) {
            return `<img ${attrs} title="${title}" loading="lazy">`;
        }
        return `<img ${attrs} loading="lazy">`;
    };
    renderer.link = ({ href, title, text }) => {
        const attrs = `href="${href}" target="_blank" rel="noopener noreferrer"`;
        if (title) {
            return `<a ${attrs} title="${title}">${text}</a>`;
        }
        return `<a ${attrs}>${text}</a>`;
    };
    return marked.parse(md, { renderer });
}

const isLargeScreen = () => window.innerWidth > 768;

function openBlogPost(id, posts) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    if (isLargeScreen()) {
        window.location.hash = `#blog/post-${id}`;
    } else {
        openBlogPostModal(post);
    }
}

function openBlogPostModal(post) {
    const content = document.getElementById('blogPostContent');
    const modal = document.getElementById('blogModal');
    const overlay = document.getElementById('blogOverlay');

    content.innerHTML = `
        <h2 class="blog-post-title">${post.title}</h2>
        <span class="blog-post-date">${formatDate(post.date)}</span>
        <div class="blog-loading">Loading...</div>
    `;
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    fetch('blog/' + post.file)
        .then(res => {
            if (!res.ok) throw new Error('Failed to load post');
            return res.text();
        })
        .then(md => {
            content.querySelector('.blog-loading').remove();
            const basePath = 'blog/' + post.file.substring(0, post.file.lastIndexOf('/') + 1);
            content.insertAdjacentHTML('beforeend', `<div class="blog-post-content">${parseMarkdown(md, basePath)}</div>`);
        })
        .catch(() => {
            content.querySelector('.blog-loading').remove();
            content.insertAdjacentHTML('beforeend', '<p class="blog-empty">Failed to load post.</p>');
        });
}

function showBlogPostPage(post) {
    const page = document.getElementById('blogPostPage');
    const content = document.getElementById('blogPostPageContent');

    document.body.classList.add('blog-view');

    content.innerHTML = `
        <h2 class="blog-post-title">${post.title}</h2>
        <span class="blog-post-date">${formatDate(post.date)}</span>
        <div class="blog-loading">Loading...</div>
    `;
    page.classList.add('active');

    document.body.style.overflow = '';
    window.scrollTo(0, 0);

    fetch('blog/' + post.file)
        .then(res => {
            if (!res.ok) throw new Error('Failed to load post');
            return res.text();
        })
        .then(md => {
            const loading = content.querySelector('.blog-loading');
            if (loading) loading.remove();
            const basePath = 'blog/' + post.file.substring(0, post.file.lastIndexOf('/') + 1);
            content.insertAdjacentHTML('beforeend', `<div class="blog-post-content">${parseMarkdown(md, basePath)}</div>`);
        })
        .catch(() => {
            const loading = content.querySelector('.blog-loading');
            if (loading) loading.remove();
            content.insertAdjacentHTML('beforeend', '<p class="blog-empty">Failed to load post.</p>');
        });
}

function hideBlogPostPage() {
    const page = document.getElementById('blogPostPage');

    page.classList.remove('active');
    document.body.classList.remove('blog-view');
}

function handleHashChange() {
    const hash = window.location.hash;

    if (hash.startsWith('#blog/post-')) {
        const id = parseInt(hash.replace('#blog/post-', ''), 10);
        const post = blogPosts.find(p => p.id === id);
        if (post) {
            if (isLargeScreen()) {
                showBlogPostPage(post);
            } else {
                hideBlogPostPage();
                openBlogPostModal(post);
            }
            return;
        }
    }

    hideBlogPostPage();
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    const overlay = document.getElementById('blogOverlay');
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('blogModalClose').addEventListener('click', closeBlogModal);
document.getElementById('blogOverlay').addEventListener('click', closeBlogModal);
document.getElementById('blogPostBack').addEventListener('click', () => {
    window.location.hash = '';
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (window.location.hash.startsWith('#blog/post-')) {
            window.location.hash = '';
        }
        closeBlogModal();
    }
});
window.addEventListener('hashchange', handleHashChange);

let blogPosts = [];

fetch('blog/posts.json')
    .then(res => {
        if (!res.ok) throw new Error('Failed to load posts');
        return res.json();
    })
    .then(posts => {
        blogPosts = posts;
        renderBlogPosts(posts);
        handleHashChange();
    })
    .catch(() => renderBlogPosts([]));

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