const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");
const container = document.getElementById("project-page");

if (!slug) {
  if (container) {
    container.innerHTML = `<p class="error-msg">No project specified. <a href="index.html">Go back to scrapbook</a></p>`;
  }
} else {
  fetch("./Data/projects.json")
    .then(response => response.json())
    .then(projects => {
      const project = projects.find(p => p.slug === slug);

      if (!container) return;

      // Handle missing project smoothly
      if (!project) {
        container.innerHTML = `<p class="error-msg">Project not found. <a href="index.html">Return to scrapbook</a></p>`;
        return;
      }

      // Render the project view layout
      container.innerHTML = `
        <section class="project-page-layout">

            <a href="index.html" class="back-link">
                ← BACK TO THE INDEX
            </a>

            <div class="project-header-meta">
                <div class="project-type">
                    ${project.type ? project.type.replace("-", " ").toUpperCase() : "PROJECT"}
                </div>
                <div class="project-date">
                    ${project.date || ""}
                </div>
            </div>

            <h1 class="project-main-title">
                ${project.title}
            </h1>

            <p class="project-intro">
                ${project.description}
            </p>

            <div class="project-actions">
                ${project.github ? `
                  <a href="${project.github}" target="_blank" rel="noopener" class="project-btn">
                      GITHUB
                  </a>
                ` : ""}

                ${project.live ? `
                  <a href="${project.live}" target="_blank" rel="noopener" class="project-btn project-btn-dark">
                      OPEN APP
                  </a>
                ` : ""}

                <button
                    class="project-btn"
                    onclick="navigator.share ? 
                    navigator.share({ title: '${project.title.replace(/'/g, "\\'")}', url: window.location.href }) : 
                    navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'))"
                >
                    SHARE
                </button>
            </div>

            <div class="project-divider"></div>

            <img
                class="project-hero-image"
                src="${project.coverImage}"
                alt="${project.title}"
            >

            ${project.gallery && project.gallery.length > 0 ? `
              <div class="project-divider"></div>
              <div class="section-label">GALLERY</div>
              <div class="gallery-grid">
                  ${project.gallery.map(img => `
                      <img src="${img}" alt="Gallery image" onclick="window.open('${img}','_blank')">
                  `).join("")}
              </div>
            ` : ""}

            ${project.impact && project.impact.length > 0 ? `
              <div class="project-divider"></div>
              <div class="section-label">IMPACT / WHAT IT DID</div>
              <p class="impact-text">
                  ${project.impact.join(" · ")}
              </p>
            ` : ""}

            <div class="project-divider"></div>

            <div class="bottom-meta">
                ${project.technologies && project.technologies.length > 0 ? `
                  <div>
                      <div class="section-label">TECHNOLOGIES</div>
                      <div class="tech-stack">
                          ${project.technologies.map(tech => `<span>${tech}</span>`).join("")}
                      </div>
                  </div>
                ` : ""}

                ${project.tags && project.tags.length > 0 ? `
                  <div>
                      <div class="section-label">TAGGED AS</div>
                      <div class="tech-stack">
                          ${project.tags.map(tag => `<span>#${tag}</span>`).join("")}
                      </div>
                  </div>
                ` : ""}
            </div>

        </section>
      `;
    })
    .catch(error => {
      console.error("Error fetching project details:", error);
      if (container) {
        container.innerHTML = `<p class="error-msg">Failed to load project details.</p>`;
      }
    });
}