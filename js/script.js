// const container = document.getElementById("container");
// const content1 = document.getElementById("page1");
// const content2 = document.getElementById("page2");
// const content3 = document.getElementById("page3");

let currentPosition = 0;

//scroll pages
const pages = document.querySelectorAll(".content");
const maxPosition = pages.length - 1;
console.log(pages);

container.addEventListener("wheel", (event) => {
  event.preventDefault();
  const direction = event.deltaY > 0 ? 1 : -1;
  currentPosition += direction;
  if (currentPosition > maxPosition) currentPosition = maxPosition;
  if (currentPosition < 0) currentPosition = 0;
  container.scrollTo({
    top: currentPosition * container.clientHeight,
    behavior: "smooth",
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    currentPosition--;
    if (currentPosition < 0) currentPosition = 0;
    container.scrollTo({
      top: currentPosition * container.clientHeight,
      behavior: "smooth",
    });
  } else if (event.key === "ArrowDown") {
    currentPosition++;
    if (currentPosition > maxPosition) currentPosition = maxPosition;
    container.scrollTo({
      top: currentPosition * container.clientHeight,
      behavior: "smooth",
    });
  }
});

document.addEventListener("wheel", function (event) {
  // Check if the user is scrolling down
  if (event.deltaY > 0) {
    // Restart the animation
    document.getElementById("animation").classList.remove("play");
    void document.getElementById("animation").offsetWidth;
    document.getElementById("animation").classList.add("play");
  }
});

document.addEventListener("keydown", function (event) {
  // Check if the user pressed the down arrow key
  if (event.keyCode === 40) {
    // Restart the animation
    document.getElementById("animation").classList.remove("play");
    void document.getElementById("animation").offsetWidth;
    document.getElementById("animation").classList.add("play");
  }
});
