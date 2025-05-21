/**
 * Gallery Module - Loads and displays gallery images from JSON data
 */
class GalleryManager {
  constructor() {
    this.galleryData = null;
    this.container = document.querySelector(".gallery-list");
    this.filterButtons = document.querySelector(".filter-button-group");
    this.isotopeInstance = null;
    this.activeFilter = ".gal_a"; // Default filter
  }

  /**
   * Initialize the gallery
   */
  async init() {
    try {
      // Show loading state
      this.showLoading(true);

      // Load gallery data from JSON file
      await this.loadGalleryData();

      // Render gallery components
      this.renderFilterButtons();
      this.renderGalleryItems();

      // Initialize Isotope after images are loaded
      await this.initIsotope();

      // Setup event listeners
      this.setupEventListeners();

      // Hide loading state
      this.showLoading(false);

      console.log("Gallery initialized successfully");
    } catch (error) {
      console.error("Failed to initialize gallery:", error);
      this.showError(
        "Failed to load gallery",
        "Please try refreshing the page."
      );
    }
  }

  /**
   * Show or hide loading state
   */
  showLoading(show) {
    let loadingEl = document.querySelector(".gallery-loading");

    if (!loadingEl && show) {
      loadingEl = document.createElement("div");
      loadingEl.className = "col-12 text-center gallery-loading";
      loadingEl.innerHTML = `
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <p class="mt-2">Loading gallery...</p>
      `;
      this.container.appendChild(loadingEl);
    } else if (loadingEl && !show) {
      loadingEl.remove();
    }
  }

  /**
   * Show error message
   */
  showError(title, message) {
    // Clear container
    this.container.innerHTML = "";

    // Create error element
    const errorEl = document.createElement("div");
    errorEl.className = "col-12 gallery-error";
    errorEl.innerHTML = `
      <h4><i class="fa fa-exclamation-triangle"></i> ${title}</h4>
      <p>${message}</p>
      <button onclick="location.reload()">Try Again</button>
    `;

    this.container.appendChild(errorEl);
  }

  /**
   * Load gallery data from JSON file
   */
  async loadGalleryData() {
    try {
      const response = await fetch("data/gallery.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      this.galleryData = await response.json();
      console.log("Gallery data loaded:", this.galleryData);
    } catch (error) {
      console.error("Error loading gallery data:", error);
      // Fallback to empty data structure
      this.galleryData = { categories: [], images: [] };
      throw error;
    }
  }

  /**
   * Render filter buttons based on categories
   */
  renderFilterButtons() {
    if (!this.galleryData || !this.galleryData.categories) return;

    // Clear existing buttons
    this.filterButtons.innerHTML = "";

    // Add "All" button first
    const allButton = document.createElement("button");
    allButton.className = "btn btn-primary";
    allButton.setAttribute("data-filter", "*");
    allButton.textContent = "All";
    this.filterButtons.appendChild(allButton);

    // Create buttons for each category
    this.galleryData.categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "btn btn-primary";
      button.setAttribute("data-filter", `.${category.filter}`);
      button.textContent = category.name;

      // Set first category button as active
      if (category.filter === "gal_a") {
        button.classList.add("active");
        // Remove active from All button
        allButton.classList.remove("active");
      }

      this.filterButtons.appendChild(button);
    });
  }

  /**
   * Render gallery items based on images data
   */
  renderGalleryItems() {
    if (!this.galleryData || !this.galleryData.images) return;

    // Clear existing gallery items (except loading)
    const loadingEl = document.querySelector(".gallery-loading");
    this.container.innerHTML = "";
    if (loadingEl) {
      this.container.appendChild(loadingEl);
    }

    // Create gallery items for each image
    this.galleryData.images.forEach((image) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = `col-md-4 col-sm-6 gallery-grid ${image.filter}`;

      galleryItem.innerHTML = `
        <div class="gallery-single fix">
          <div class="category-label">${this.getCategoryName(
            image.category
          )}</div>
          <img src="${image.src}" class="img-fluid rounded" alt="${
        image.alt
      }" data-id="${image.id}">
          <div class="img-overlay">
            <a href="${image.src}" data-lightbox="${image.category}" 
               data-title="${image.title}: ${image.description}" 
               class="hoverbutton global-radius">
              <i class="fa fa-search-plus"></i>
            </a>
          </div>
        </div>
      `;

      this.container.appendChild(galleryItem);
    });
  }

  /**
   * Get category name by id
   */
  getCategoryName(categoryId) {
    const category = this.galleryData.categories.find(
      (cat) => cat.id === categoryId
    );
    return category ? category.name : "Unknown";
  }

  /**
   * Initialize Isotope after images are loaded
   */
  async initIsotope() {
    return new Promise((resolve) => {
      // Wait for images to load
      imagesLoaded(this.container, () => {
        // Destroy existing instance if it exists
        if (this.isotopeInstance) {
          this.isotopeInstance.destroy();
        }

        // Initialize Isotope
        this.isotopeInstance = new Isotope(this.container, {
          itemSelector: ".gallery-grid",
          layoutMode: "masonry",
          masonry: {
            columnWidth: ".gallery-grid",
            gutter: 20,
          },
          transitionDuration: "0.6s",
          stagger: 50,
        });

        // Apply initial filter
        this.isotopeInstance.arrange({
          filter: this.activeFilter,
        });

        console.log("Isotope initialized with filter:", this.activeFilter);
        resolve();
      });
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Remove any existing event listeners
    this.filterButtons.removeEventListener("click", this.handleFilterClick);

    // Filter button click event
    this.filterButtons.addEventListener(
      "click",
      this.handleFilterClick.bind(this)
    );

    // Initialize lightbox
    lightbox.option({
      resizeDuration: 300,
      wrapAround: true,
      albumLabel: "Image %1 of %2",
      fadeDuration: 300,
      imageFadeDuration: 300,
      positionFromTop: 100,
      maxWidth: 1000,
      maxHeight: 800,
    });
  }

  /**
   * Handle filter button click
   */
  handleFilterClick(event) {
    if (event.target.tagName === "BUTTON") {
      // Update active button
      const buttons = this.filterButtons.querySelectorAll("button");
      buttons.forEach((btn) => btn.classList.remove("active"));
      event.target.classList.add("active");

      // Get filter value
      const filterValue = event.target.getAttribute("data-filter");
      this.activeFilter = filterValue;

      console.log("Filter clicked:", filterValue);

      // Apply filter
      if (this.isotopeInstance) {
        this.isotopeInstance.arrange({
          filter: filterValue,
        });

        // Add animation to filtered items
        setTimeout(() => {
          const filteredItems = document.querySelectorAll(
            filterValue !== "*" ? filterValue : ".gallery-grid"
          );
          filteredItems.forEach((item) => {
            item.classList.add("animated");
          });
        }, 300);
      } else {
        console.error("Isotope instance not initialized");
      }
    }
  }
}

// Initialize gallery when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const gallery = new GalleryManager();
  gallery.init();
});
