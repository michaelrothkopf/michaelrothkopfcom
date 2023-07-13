// The button to toggle whether the navigation is collapsed
const navCollapseButton = document.getElementById('nav-toggle');

// Add a handler for when the nav collapse button is clicked
navCollapseButton.addEventListener('click', (e) => {
  e.preventDefault();

  // Toggle whether the child elements of the collapse button have been activated
  for (const bar of navCollapseButton.children) {
    // Toggle the nav-toggle__bar--open class
    bar.classList.toggle('nav-toggle__bar--open');
  }

  // Toggle whether the nav-main__collapsible is collapsed
  document.getElementById('nav-main__collapsible').classList.toggle('nav-main__collapsible--collapsed');
});