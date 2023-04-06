// const container = document.getElementById("container");
// const content1 = document.getElementById("page1");
// const content2 = document.getElementById("page2");
// const content3 = document.getElementById("page3");

//initialise page count as currentPosition at 0
export let currentPosition = 0;

//return updated currentpostion
export function getCurrentPosition() {
  return currentPosition;
}

//count pages under ".content" class
const pages = document.querySelectorAll(".content");

//return the max page count
const pageCountMax = pages.length - 1;

//add even listen to wheel scroll
container.addEventListener("wheel", (event) => {
  //disable defaul scroll action
  event.preventDefault();
  const direction = event.deltaY > 0 ? 1 : -1;
  currentPosition += direction;
  //limit max and min page number
  if (currentPosition > pageCountMax) currentPosition = pageCountMax;
  if (currentPosition < 0) currentPosition = 0;
  container.scrollTo({
    top: currentPosition * container.clientHeight,
    behavior: "smooth",
  });
  // console.log(Array.from(pages));
  console.log("page " + currentPosition);
});

//add even listen to arrow key
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    // If the up arrow is pressed, decrease page number
    currentPosition--;
    if (currentPosition < 0) currentPosition = 0;
    container.scrollTo({
      top: currentPosition * container.clientHeight,
      behavior: "smooth",
    });
  } else if (event.key === "ArrowDown") {
    currentPosition++;
    if (currentPosition > pageCountMax) currentPosition = pageCountMax;
    container.scrollTo({
      top: currentPosition * container.clientHeight,
      behavior: "smooth",
    });
  }
});
