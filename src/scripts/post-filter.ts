// Track observer at module level to prevent stacking
let _scrollObserver: IntersectionObserver | null = null;
let _popstateListener: ((e: PopStateEvent) => void) | null = null;

document.addEventListener('astro:page-load', () => {
  // Disconnect previous observer if it exists
  _scrollObserver?.disconnect();
  _scrollObserver = null;

  const filterBtns = document.querySelectorAll('.tag-filter-btn');
  const posts = document.querySelectorAll('.post-card');
  
  // Check URL for tag parameter
  const params = new URLSearchParams(window.location.search);
  const initialTag = params.get('tag');

  let currentLimit = 10;
  let activeTag = initialTag || 'all';

  function applyFiltersAndPagination() {
    let visibleCount = 0;
    
    posts.forEach(post => {
      const postTags = (post.getAttribute('data-tags') || '').split(',');
      const matchesTag = activeTag === 'all' || postTags.includes(activeTag);
      
      if (matchesTag) {
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

  function filterPosts(selectedTag: string) {
    activeTag = selectedTag;
    currentLimit = 10; // Reset pagination on new filter
    
    // Update active button
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tag') === selectedTag);
    });

    applyFiltersAndPagination();
  }

  // Initialize if URL has tag
  if (initialTag) {
    const btnExists = Array.from(filterBtns).some(btn => btn.getAttribute('data-tag') === initialTag);
    if (btnExists) {
      filterPosts(initialTag);
      // Auto-scroll to tags to show we are filtering
      setTimeout(() => {
        document.querySelector('.tags-filter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      applyFiltersAndPagination();
    }
  } else {
    applyFiltersAndPagination();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const tag = target ? target.getAttribute('data-tag') : null;
      if (tag) {
        const url = new URL(window.location.href);
        if (tag === 'all') {
          url.searchParams.delete('tag');
        } else {
          url.searchParams.set('tag', tag);
        }
        window.history.pushState({}, '', url);
        
        filterPosts(tag);
      }
    });
  });

  const resetBtn = document.getElementById('reset-filter-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelector<HTMLElement>('.tag-filter-btn[data-tag="all"]')?.click();
    });
  }

  if (_popstateListener) {
    window.removeEventListener('popstate', _popstateListener);
  }
  _popstateListener = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag') || 'all';
    filterPosts(tag);
  };
  window.addEventListener('popstate', _popstateListener);

  // Infinite Scroll Logic
  if (_scrollObserver) {
    _scrollObserver.disconnect();
  }
  _scrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      currentLimit += 6; // Load 6 more (two rows) on scroll
      applyFiltersAndPagination();
    }
  }, { rootMargin: '400px' }); // Trigger 400px before reaching the bottom

  const trigger = document.getElementById('infinite-scroll-trigger');
  if (trigger) _scrollObserver.observe(trigger);

});

document.addEventListener('astro:before-swap', () => {
  if (_scrollObserver) {
    _scrollObserver.disconnect();
    _scrollObserver = null;
  }
  if (_popstateListener) {
    window.removeEventListener('popstate', _popstateListener);
    _popstateListener = null;
  }
});
