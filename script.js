let allProjects = [];

const grid = document.getElementById("projects");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const typeSelect = document.getElementById("typeSelect");
const langSelect = document.getElementById("langSelect");
const tagSelect = document.getElementById("tagSelect");

// 1. FETCH & INITIALIZE
fetch("./Data/projects.json")
  .then(res => res.json())
  .then(projects => {
    allProjects = projects;
    updateStats(projects);
    populateFilters(projects);
    renderProjects(projects);
    setupListeners();
  })
  .catch(err => {
    console.error("Failed to load projects:", err);
  });

// 2. RENDER CARD GRID
function renderProjects(projects) {
  grid.innerHTML = "";

  if (projects.length === 0) {
    grid.innerHTML = `<p class="no-results">No projects match your criteria.</p>`;
    return;
  }

  projects.forEach(project => {
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = `project.html?slug=${project.slug}`;

    card.innerHTML = `
      <div class="project-image-wrapper">
        <img
          class="project-image"
          src="${project.coverImage}"
          alt="${project.title}"
          loading="lazy"
        >
      </div>

      <div class="project-content">
        <div class="project-meta">
          <div class="project-type">
            ${project.type ? project.type.replace("-", " ") : ""}
          </div>
          ${project.featured ? `<div class="featured">FEATURED</div>` : ""}
        </div>

        <h2 class="project-title">${project.title}</h2>
        <p class="project-description">${project.description}</p>

        <div class="project-tags">
          ${project.technologies
            .map(tech => `<span class="project-tag">${tech}</span>`)
            .join("")}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// 3. UPDATE HERO STATS
function updateStats(projects) {
  const technologies = new Set();
  projects.forEach(project => {
    if (project.technologies) {
      project.technologies.forEach(tech => technologies.add(tech));
    }
  });

  const projectCountEl = document.getElementById("projectCount");
  const techCountEl = document.getElementById("techCount");

  if (projectCountEl) projectCountEl.textContent = `${projects.length} PROJECTS`;
  if (techCountEl) techCountEl.textContent = `${technologies.size} TECHNOLOGIES`;
}

// 4. POPULATE FILTER DROP-DOWNS Dynamically
function populateFilters(projects) {
  const types = new Set();
  const langs = new Set();
  const tags = new Set();

  projects.forEach(project => {
    if (project.type) types.add(project.type);
    if (project.technologies) project.technologies.forEach(t => langs.add(t));
    if (project.tags) project.tags.forEach(tag => tags.add(tag));
  });

  // Keep default "All" or placeholder options intact by using entry loops
  if (typeSelect) {
    types.forEach(type => {
      typeSelect.innerHTML += `<option value="${type}">${type}</option>`;
    });
  }

  if (langSelect) {
    langs.forEach(lang => {
      langSelect.innerHTML += `<option value="${lang}">${lang}</option>`;
    });
  }

  if (tagSelect) {
    tags.forEach(tag => {
      tagSelect.innerHTML += `<option value="${tag}">${tag}</option>`;
    });
  }
}

// 5. EVENT LISTENERS
function setupListeners() {
  const elements = [searchInput, sortSelect, typeSelect, langSelect, tagSelect];
  
  elements.forEach(el => {
    if (el) {
      el.addEventListener("input", applyFilters);
      el.addEventListener("change", applyFilters);
    }
  });
}

// 6. FILTER & SORT LOGIC
function applyFilters() {
  let filtered = [...allProjects];

  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const type = typeSelect ? typeSelect.value : "all";
  const lang = langSelect ? langSelect.value : "all";
  const tag = tagSelect ? tagSelect.value : "all";
  const sort = sortSelect ? sortSelect.value : "newest";

  // Text Search
  if (search) {
    filtered = filtered.filter(project => {
      return (
        project.title.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search)
      );
    });
  }

  // Type Filter
  if (type && type !== "all") {
    filtered = filtered.filter(p => p.type === type);
  }

  // Technology Filter
  if (lang && lang !== "all") {
    filtered = filtered.filter(p => p.technologies && p.technologies.includes(lang));
  }

  // Tag Filter
  if (tag && tag !== "all") {
    filtered = filtered.filter(p => p.tags && p.tags.includes(tag));
  }

  // Date Sorting
  if (sort === "newest") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sort === "oldest") {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  renderProjects(filtered);
}

const params = new URLSearchParams(
  window.location.search
);

const slug = params.get("slug");

fetch("./Data/projects.json")
  .then(res => res.json())
  .then(projects => {

    const project =
      projects.find(
        p => p.slug === slug
      );

    if (!project) {

      document.getElementById(
        "project-page"
      ).innerHTML = `
        <h1>Project not found.</h1>
      `;

      return;
    }

    renderProject(project);

  });

  function renderProject(project) {

const container =
document.getElementById(
"project-page"
);

container.innerHTML = `

<section class="project-view">

<div class="project-label">
${project.type}
</div>

<h1 class="project-view-title">
${project.title}
</h1>

<p class="project-view-description">
${project.description}
</p>

<div class="project-links">

<a
href="${project.github}"
target="_blank"
class="project-button"
>
Github
</a>

<a
href="${project.live}"
target="_blank"
class="project-button"
>
Visit
</a>

</div>

<div class="project-divider"></div>

<img
class="project-cover"
src="${project.coverImage}"
alt="${project.title}"
>

<div class="project-divider"></div>

<h2>Story</h2>

<p class="project-story">
${project.story}
</p>

<div class="project-divider"></div>

<h2>Impact</h2>

<ul class="impact-list">

${project.impact
.map(
item =>
`<li>${item}</li>`
)
.join("")}

</ul>

<div class="project-divider"></div>

<h2>Gallery</h2>

<div class="gallery">

${project.gallery
.map(
img =>
`
<img
src="${img}"
alt=""
>
`
)
.join("")}

</div>

</section>

`;

}


const loader =
document.getElementById("loader");

const visited =
localStorage.getItem("scrapbookLoaded");

const delay =
visited ? 600 : 6000;

setTimeout(() => {

    loader.style.opacity = "0";

    setTimeout(() => {
        loader.remove();
    },800);

},delay);

localStorage.setItem(
    "scrapbookLoaded",
    "true"
);