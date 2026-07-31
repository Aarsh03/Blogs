---
title: "Hello World — My First Post"
date: 2026-07-31
tags: ["intro", "coding"]
description: "Welcome to my blog! This is my very first post where I talk about what to expect."
draft: false
---

Welcome to my brand new blog! I'm so excited to finally have a space on the internet where I can share my thoughts, projects, and things I learn along the way. I've been wanting to start a technical blog for quite some time now, and with the latest tools available, it felt like the perfect moment to just dive in and start building.

In this blog, I plan to cover a variety of topics, mostly centered around web development, design systems, and my journey as a developer. You can expect articles about:

- Front-end frameworks and tooling
- CSS tips, tricks, and elegant design patterns
- Personal project deep-dives
- Book and article reviews that inspire me

> "The secret to getting ahead is getting started." — Mark Twain

One of the things I love most about modern web development is how accessible great design has become. For example, here's a quick snippet I used to set up some of the core routing in my application:

```javascript
function handleNavigation(route) {
  if (!route) return;
  console.log(`Navigating to: ${route.path}`);
  
  // Update browser history
  window.history.pushState({}, '', route.path);
  
  // Render new content
  renderView(route.component);
}
```

I hope you'll stick around for the journey. Feel free to explore the tags, check out my upcoming posts, and let me know what you think of the new pastel theme. Thanks for stopping by!
