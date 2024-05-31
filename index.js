// script.js

document.addEventListener("DOMContentLoaded", () => {
  const jobListingsContainer = document.getElementById("job-listings");

  // Fetch data from JSON file
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      displayJobListings(data);
      addFiltering(data);
    });

  // Display job listings
  function displayJobListings(jobs) {
    jobListingsContainer.innerHTML = ""; // Clear existing listings

    jobs.forEach((job) => {
      const jobElement = document.createElement("div");
      jobElement.className = "job-container";

      jobElement.innerHTML = `
          <div class="job-header">
            <img src="${job.logo}" alt="${job.company} Logo">
            <div>
              <span>${job.company}</span>
              <h2>${job.position}${
        job.new ? '<span class="new">NEW!</span>' : ""
      }</h2>
            </div>
          </div>
          <div class="job-details">
            <span>${job.postedAt}</span>
            <span>${job.contract}</span>
            <span>${job.location}</span>
          </div>
          <div class="job-tags">
            ${[job.role, job.level, ...job.languages, ...job.tools]
              .map((tag) => `<span class="job-tag">${tag}</span>`)
              .join("")}
          </div>
        `;

      jobListingsContainer.appendChild(jobElement);
    });
  }

  // Add filtering functionality
  function addFiltering(jobs) {
    const filterInput = document.createElement("input");
    filterInput.type = "text";
    filterInput.placeholder = "Filter by category";
    filterInput.addEventListener("input", (e) => {
      const filteredJobs = jobs.filter((job) => {
        const tags = [job.role, job.level, ...job.languages, ...job.tools];
        return tags.some((tag) =>
          tag.toLowerCase().includes(e.target.value.toLowerCase())
        );
      });
      displayJobListings(filteredJobs);
    });

    jobListingsContainer.parentElement.insertBefore(
      filterInput,
      jobListingsContainer
    );
  }
});
