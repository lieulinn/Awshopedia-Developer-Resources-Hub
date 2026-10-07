// DEVELOPER RESOURCES DATABASE
const resourcesData = [
  {
    id: 1,
    title: "MDN Web Docs",
    category: "HTML",
    description: "Dokumentasi standar industri paling komprehensif untuk HTML, CSS, dan JavaScript API.",
    link: "https://developer.mozilla.org",
    level: "Beginner"
  },
  {
    id: 2,
    title: "CSS-Tricks",
    category: "CSS",
    description: "Panduan lengkap seputar Flexbox, CSS Grid, animasi, serta trik styling antarmuka modern.",
    link: "https://css-tricks.com",
    level: "Intermediate"
  },
  {
    id: 3,
    title: "JavaScript.info",
    category: "JavaScript",
    description: "Tutorial JavaScript modern dari dasar hingga topik tingkat lanjut seperti Promises, Async/Await, dan Closures.",
    link: "https://javascript.info",
    level: "Beginner - Advanced"
  },
  {
    id: 4,
    title: "React Official Docs",
    category: "React",
    description: "Dokumentasi resmi React dengan konsep Hooks, Server Components, dan arsitektur komponen.",
    link: "https://react.dev",
    level: "Intermediate"
  },
  {
    id: 5,
    title: "Git Documentation",
    category: "Git",
    description: "Referensi perintah Git, branching strategy, serta penanganan konflik versi kode.",
    link: "https://git-scm.com/doc",
    level: "Beginner"
  },
  {
    id: 6,
    title: "GitHub Skills",
    category: "GitHub",
    description: "Kursus interaktif resmi dari GitHub untuk menguasai Pull Request, Actions, dan Collaboration.",
    link: "https://skills.github.com",
    level: "Beginner"
  },
  {
    id: 7,
    title: "Public APIs Directory",
    category: "API",
    description: "Kumpulan API gratis teruji untuk pengujian aplikasi, proyek portofolio, dan integrasi data.",
    link: "https://github.com/public-apis/public-apis",
    level: "All Levels"
  },
  {
    id: 8,
    title: "Tailwind CSS Docs",
    category: "CSS",
    description: "Kerangka kerja Utility-First CSS untuk membangun antarmuka web kustom dengan cepat.",
    link: "https://tailwindcss.com",
    level: "Intermediate"
  },
  {
    id: 9,
    title: "Lucide Icons",
    category: "UI Resources",
    description: "Koleksi ikon open-source yang bersih, konsisten, dan mudah diintegrasikan ke proyek web.",
    link: "https://lucide.dev",
    level: "All Levels"
  },
  {
    id: 10,
    title: "JSONPlaceholder",
    category: "API",
    description: "REST API buatan gratis untuk mocking data pengguna, postingan, dan komentar saat pengembangan.",
    link: "https://jsonplaceholder.typicode.com",
    level: "Beginner"
  }
];

document.addEventListener('DOMContentLoaded', () => {

  const resourcesGrid = document.getElementById('resourcesGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const navItems = document.querySelectorAll('.nav-item[data-category]');
  const bookmarksTab = document.getElementById('bookmarksTab');
  const currentCategoryTitle = document.getElementById('currentCategoryTitle');
  const categoryCount = document.getElementById('categoryCount');
  const totalResources = document.getElementById('totalResources');
  const bookmarkCountEl = document.getElementById('bookmarkCount');

  let activeCategory = 'All';
  let showingBookmarks = false;
  let bookmarkedIds = JSON.parse(localStorage.getItem('devhub_bookmarks')) || [];

  // Initialize Statistics
  totalResources.textContent = resourcesData.length;

  function updateBookmarkCount() {
    bookmarkCountEl.textContent = bookmarkedIds.length;
  }

  // Toggle Bookmark logic
  window.toggleBookmark = function(id) {
    if (bookmarkedIds.includes(id)) {
      bookmarkedIds = bookmarkedIds.filter(bId => bId !== id);
    } else {
      bookmarkedIds.push(id);
    }
    localStorage.setItem('devhub_bookmarks', JSON.stringify(bookmarkedIds));
    updateBookmarkCount();
    renderResources();
  };

  // Create Card Element
  function createResourceCard(item) {
    const isBookmarked = bookmarkedIds.includes(item.id);
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML = `
      <div>
        <div class="card-top">
          <span class="category-badge">${item.category}</span>
          <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark(${item.id})">
            <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
          </button>
        </div>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-description">${item.description}</p>
      </div>
      <div class="card-bottom">
        <span class="level-badge"><i class="fa-solid fa-layer-group"></i> ${item.level}</span>
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="explore-link">
          Explore <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    `;
    return card;
  }

  // Render Filtered Resources
  function renderResources() {
    resourcesGrid.innerHTML = '';
    const query = searchInput.value.toLowerCase().trim();

    let filtered = resourcesData.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(query) || 
                            item.description.toLowerCase().includes(query) ||
                            item.category.toLowerCase().includes(query);
      const matchesBookmark = showingBookmarks ? bookmarkedIds.includes(item.id) : true;

      return matchesCategory && matchesSearch && matchesBookmark;
    });

    categoryCount.textContent = `${filtered.length} items`;

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      filtered.forEach(item => {
        resourcesGrid.appendChild(createResourceCard(item));
      });
    }
  }

  // Category Selection
  navItems.forEach(button => {
    button.addEventListener('click', () => {
      navItems.forEach(btn => btn.classList.remove('active'));
      bookmarksTab.classList.remove('active');
      button.classList.add('active');

      showingBookmarks = false;
      activeCategory = button.getAttribute('data-category');
      currentCategoryTitle.textContent = activeCategory === 'All' ? 'All Resources' : `${activeCategory} Resources`;
      renderResources();
    });
  });

  // Bookmarks Tab Click
  bookmarksTab.addEventListener('click', () => {
    navItems.forEach(btn => btn.classList.remove('active'));
    bookmarksTab.classList.add('active');

    showingBookmarks = true;
    activeCategory = 'All';
    currentCategoryTitle.textContent = 'Saved Bookmarks';
    renderResources();
  });

  // Real-time Search Input
  searchInput.addEventListener('input', renderResources);

  // Keyboard shortcut '/' to search
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Initial Load
  updateBookmarkCount();
  renderResources();
});