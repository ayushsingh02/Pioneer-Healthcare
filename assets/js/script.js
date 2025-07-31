// Hamburger Menu
if (document.querySelector(".header-hamburger")) {
  const hamburger = document.querySelector(".header-hamburger");
  const headerLinks = document.querySelector(".header-links");
  const header = document.querySelector("header");
  const navDrops = document.querySelectorAll(".navdrop");
  const breadcrumb = document.querySelector(".mobile-breadcrumb");
  const breadcrumbTitle = document.querySelector(".breadcrumb-title");
  const backBtn = document.querySelector(".back-btn");
  const mobileApplyBtn = document.querySelector(".custom-btn.yellow.mobile");
  const headerLinkList = document.querySelector(".header-link-list");

  // Mobile menu toggle
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = headerLinks.classList.toggle("open");
    hamburger.classList.toggle("clicked", isOpen);
    header.classList.toggle("white", isOpen);
  });

  // Close when clicking outside
  document.addEventListener("click", function (e) {
    if (!headerLinks.contains(e.target)) {
      headerLinks.classList.remove("open");
      hamburger.classList.remove("clicked");
      header.classList.remove("white");
    }
  });

  // Mobile submenu navigation
  document.querySelectorAll(".header-links .nav-link > a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (window.innerWidth < 1300) {
        const navDrop = anchor.closest(".nav-link")?.nextElementSibling;
        if (navDrop?.classList.contains("navdrop")) {
          e.preventDefault();
          navDrops.forEach((drop) => drop.classList.remove("active"));
          navDrop.classList.add("active");
          breadcrumb?.classList.remove("hidden");
          breadcrumbTitle &&
            (breadcrumbTitle.textContent = anchor.textContent.trim());
          mobileApplyBtn?.style.setProperty("display", "none", "important");
          headerLinkList?.classList.add("hide");
        }
      }
    });
  });

  // Back button
  backBtn?.addEventListener("click", () => {
    navDrops.forEach((drop) => drop.classList.remove("active"));
    breadcrumb?.classList.add("hidden");
    breadcrumbTitle && (breadcrumbTitle.textContent = "");
    mobileApplyBtn?.style.removeProperty("display");
    headerLinkList?.classList.remove("hide");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const nextLink = document.querySelector("a.pagination-link.next");
  if (nextLink) {
    nextLink.innerHTML = `
     
<svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.990716 2.02777L4.67802 5.71508L0.990716 9.40238C0.620086 9.77301 0.620086 10.3717 0.990716 10.7424C1.36135 11.113 1.96006 11.113 2.33069 10.7424L6.69273 6.38031C7.06336 6.00968 7.06336 5.41097 6.69273 5.04034L2.33069 0.678299C1.96006 0.307668 1.36135 0.307668 0.990716 0.678299C0.629589 1.04893 0.620086 1.65714 0.990716 2.02777Z" fill="#1A1A1A"/>
</svg>

    `;
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const nextLink = document.querySelector("a.pagination-link.prev");
  if (nextLink) {
    nextLink.innerHTML = `
      
<svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.04053 9.39288L2.35323 5.70558L6.04053 2.01828C6.41116 1.64764 6.41116 1.04893 6.04053 0.678303C5.6699 0.307672 5.07119 0.307672 4.70056 0.678303L0.33852 5.04034C-0.0321108 5.41097 -0.0321108 6.00969 0.33852 6.38032L4.70056 10.7424C5.07119 11.113 5.6699 11.113 6.04053 10.7424C6.40166 10.3717 6.41116 9.76351 6.04053 9.39288Z" fill="#1A1A1A"/>
</svg>

    `;
  }
});
