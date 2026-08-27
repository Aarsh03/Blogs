// Track observer at module level to prevent stacking
let _scrollObserver: IntersectionObserver | null = null;
let _popstateListener: ((e: PopStateEvent) => void) | null = null;
let _keydownListener: ((e: KeyboardEvent) => void) | null = null;

document.addEventListener('astro:page-load', () => {
  // Disconnect previous observers and listeners
  _scrollObserver?.disconnect();
  _scrollObserver = null;
  
  const posts = document.querySelectorAll('.post-card');
  const activeTagsContainer = document.getElementById('active-tags-container');
  const openModalBtn = document.getElementById('open-tag-modal-btn');
  const modal = document.getElementById('tag-modal');
  const modalBackdrop = document.getElementById('tag-modal-backdrop');
  const modalClose = document.getElementById('tag-modal-close');
  const modalApply = document.getElementById('tag-modal-apply');
  const modalClear = document.getElementById('tag-modal-clear');
  const modalChips = document.querySelectorAll('.tag-modal-chip');

  if (!posts.length || !openModalBtn) return; // Not on the blog index page

  // State
  let currentLimit = 10;
  let activeTags: string[] = [];
  let tempTags: string[] = [];

  // Parse URL for initial tags
  const params = new URLSearchParams(window.location.search);
  const tagsParam = params.get('tags');
  if (tagsParam) {
    activeTags = tagsParam.split(',').filter(Boolean);
  }

  function applyFiltersAndPagination() {
    let visibleCount = 0;
    
    posts.forEach(post => {
      const postTags = (post.getAttribute('data-tags') || '').split(',');
      
      // AND Logic: Post must have ALL selected tags
      const matchesAllTags = activeTags.length === 0 || activeTags.every(tag => postTags.includes(tag));
      
      if (matchesAllTags) {
        visibleCount++;
        if (visibleCount <= currentLimit) {
          post.classList.remove('hidden');
        } else {
          post.classList.add('hidden');
        }
      } else {
        post.classList.add('hidden');
      }
    });

    const emptyState = document.getElementById('empty-filter-state');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  function updateUrl() {
    const url = new URL(window.location.href);
    if (activeTags.length === 0) {
      url.searchParams.delete('tags');
    } else {
      url.searchParams.set('tags', activeTags.join(','));
    }
    window.history.pushState({}, '', url);
  }

  function renderActiveTags() {
    if (!activeTagsContainer) return;
    
    activeTagsContainer.innerHTML = '';
    
    activeTags.forEach(tag => {
      const chip = document.createElement('div');
      chip.className = 'active-tag-chip';
      chip.innerHTML = `
        ${tag}
        <button class="active-tag-chip__remove" aria-label="Remove ${tag}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      
      const removeBtn = chip.querySelector('button');
      removeBtn?.addEventListener('click', () => {
        activeTags = activeTags.filter(t => t !== tag);
        updateUrl();
        renderActiveTags();
        currentLimit = 10;
        applyFiltersAndPagination();
      });
      
      activeTagsContainer.appendChild(chip);
    });
  }

  // --- Modal Logic ---
  function syncModalUI() {
    modalChips.forEach(chip => {
      const tag = chip.getAttribute('data-modal-tag');
      if (tag && tempTags.includes(tag)) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    });
  }

  function openModal() {
    if (!modal) return;
    tempTags = [...activeTags]; // Copy active tags to temp state
    syncModalUI();
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalBtn.addEventListener('click', openModal);
  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);

  modalChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-modal-tag');
      if (!tag) return;
      
      if (tempTags.includes(tag)) {
        tempTags = tempTags.filter(t => t !== tag);
      } else {
        tempTags.push(tag);
      }
      syncModalUI();
    });
  });

  modalClear?.addEventListener('click', () => {
    tempTags = [];
    syncModalUI();
  });

  modalApply?.addEventListener('click', () => {
    activeTags = [...tempTags];
    updateUrl();
    renderActiveTags();
    currentLimit = 10; // Reset pagination
    applyFiltersAndPagination();
    closeModal();
  });

  // Handle escape key
  if (_keydownListener) {
    document.removeEventListener('keydown', _keydownListener);
  }
  _keydownListener = (e) => {
    if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  };
  document.addEventListener('keydown', _keydownListener);


  // --- Initialization ---
  renderActiveTags();
  applyFiltersAndPagination();

  // Reset filter button in empty state
  const resetBtn = document.getElementById('reset-filter-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeTags = [];
      updateUrl();
      renderActiveTags();
      currentLimit = 10;
      applyFiltersAndPagination();
    });
  }

  // Browser back/forward navigation
  if (_popstateListener) {
    window.removeEventListener('popstate', _popstateListener);
  }
  _popstateListener = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagStr = urlParams.get('tags');
    activeTags = tagStr ? tagStr.split(',').filter(Boolean) : [];
    renderActiveTags();
    currentLimit = 10;
    applyFiltersAndPagination();
  };
  window.addEventListener('popstate', _popstateListener);

  // Infinite Scroll Logic
  _scrollObserver?.disconnect();
  _scrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      currentLimit += 6; // Load 6 more on scroll
      applyFiltersAndPagination();
    }
  }, { rootMargin: '400px' }); 

  const trigger = document.getElementById('infinite-scroll-trigger');
  if (trigger) _scrollObserver.observe(trigger);

});

document.addEventListener('astro:before-swap', () => {
  _scrollObserver?.disconnect();
  _scrollObserver = null;
  
  if (_popstateListener) {
    window.removeEventListener('popstate', _popstateListener);
    _popstateListener = null;
  }
  if (_keydownListener) {
    document.removeEventListener('keydown', _keydownListener);
    _keydownListener = null;
  }
});
