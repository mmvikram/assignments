document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(
    ".collection-by-name-wrapper .collection-button",
  );
  const sections = document.querySelectorAll(
    ".collection-by-name-wrapper .collection-section",
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Hide all sections
      sections.forEach((section) => {
        section.style.display = "none";
      });

      buttons.forEach((button) => {
        if (button.dataset.collection === e.target.dataset.collection) {
          if (!button.classList.contains("active")) {
            button.classList.add("active");
          }
        } else {
          if (button.classList.contains("active")) {
            button.classList.remove("active");
          }
        }
      });

      // Show the corresponding section
      const collection = e.target.dataset.collection;
      const section = document.getElementById(
        "collection-" + collection.toLowerCase().replace(/\s+/g, "-"),
      );
      console.log(section);
      if (section) {
        section.style.display = "flex";
      }
    });
  });
});
