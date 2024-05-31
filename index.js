document.addEventListener("DOMContentLoaded", () => {
  const jobListingsContainer = document.getElementById("job-listings");
  const filterContainer = document.querySelector(".filter-container");
  const filterTagsContainer = document.querySelector(".filter-tags");
  const clearFiltersBtn = document.querySelector(".clear-filters");

  let jobsData = [];
  let activeFilters = [];

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      jobsData = data;
      displayJobListings(jobsData);
    });

  function displayJobListings(jobs) {
    jobListingsContainer.innerHTML = "";

    jobs.forEach((job) => {
      const jobElement = document.createElement("div");
      jobElement.className = "job-container";

      jobElement.innerHTML = `
          <div class="job-header">
            <img src="${job.logo}" alt="${job.company} Logo">
            <div class="job-info">
              <span>${job.company}</span>
              <h2>${job.position}${
        job.new ? '<span class="new">NEW!</span>' : ""
      }${job.featured ? '<span class="featured">FEATURED</span>' : ""}</h2>
              <div class="job-details">
                <span>${job.postedAt}</span>
                <span>${job.contract}</span>
                <span>${job.location}</span>
              </div>
            </div>
          </div>
          <div class="job-tags">
            ${[job.role, job.level, ...job.languages, ...job.tools]
              .map((tag) => `<span class="job-tag">${tag}</span>`)
              .join("")}
          </div>
        `;

      jobListingsContainer.appendChild(jobElement);

      const tags = jobElement.querySelectorAll(".job-tag");
      tags.forEach((tag) => {
        tag.addEventListener("click", () => {
          if (!activeFilters.includes(tag.textContent)) {
            activeFilters.push(tag.textContent);
            updateFilters();
            filterJobs();
          }
        });
      });
    });
  }

  function updateFilters() {
    filterTagsContainer.innerHTML = activeFilters
      .map(
        (filter) => `
        <div class="filter-tag">
          ${filter}
          <span class="remove-tag" data-filter="${filter}">×</span>
        </div>
      `
      )
      .join("");

    const removeTags = filterTagsContainer.querySelectorAll(".remove-tag");
    removeTags.forEach((removeTag) => {
      removeTag.addEventListener("click", () => {
        activeFilters = activeFilters.filter(
          (f) => f !== removeTag.getAttribute("data-filter")
        );
        updateFilters();
        filterJobs();
      });
    });

    filterContainer.style.display = activeFilters.length ? "flex" : "none";
  }

  function filterJobs() {
    const filteredJobs = jobsData.filter((job) => {
      const tags = [job.role, job.level, ...job.languages, ...job.tools];
      return activeFilters.every((filter) => tags.includes(filter));
    });
    displayJobListings(filteredJobs);
  }

  clearFiltersBtn.addEventListener("click", () => {
    activeFilters = [];
    updateFilters();
    displayJobListings(jobsData);
  });

  updateFilters();
});
