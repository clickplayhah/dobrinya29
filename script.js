(() => {
  const dialog = document.querySelector("dialog");
  const buttons = document.querySelectorAll("button[data-dialog-open]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      dialog.showModal();
    });
  });
  const closeButton = document.querySelector("button[data-dialog-close]");
  closeButton.addEventListener("click", () => {
      dialog.close();
  })
})();
