"use strict";

const storiesContainer = document.getElementById("stories-container");
const storyContainer = document.getElementById("story-container");

fetch(
  "https://content.guardianapis.com/search?section=world&show-fields=all&show-blocks=body&api-key=test"
)
  .then((res) => res.json())
  .then((res) => handleRes(res))
  .catch((e) => console.log("Fetch failed >>", e));

function handleRes(data) {
  // Access fetched data as array
  let dataArray = Object.entries(data.response.results);

  console.log("dataArray>>>", dataArray);

  // Create each article using map
  let article, articleContent, button;

  console.log(article);

  dataArray.map((story) => {
    // Construct content of each with template literal
    articleContent = `
                <h3>${story[1].webTitle}</h3>
                <img src="${story[1].fields.thumbnail}">
                <p>${story[1].fields.trailText}</p>
              `;

    // Create article element (container)
    article = document.createElement("article");
    // Set innerHTML of article element to template
    article.innerHTML = articleContent;
    // Create and append button to show full story
    button = document.createElement("button");
    button.innerText = "Read full story";
    button.className = "showStory";
    button.addEventListener("click", showFullStory);
    article.append(button);
    // Save data for full story view in element attributes
    article.setAttribute("title", story[1].webTitle);
    article.setAttribute("body", story[1].blocks.body[0].bodyHtml);
    article.setAttribute("img", story[1].fields.main);
    article.setAttribute("author", story[1].fields.byline);

    // append article so it appears in headlines view
    // IF it is an article
    if (story[1].type === "article") {
      storiesContainer.append(article);
    }
  });

  // Generate button to refresh headlines and
  // append to header element
  button = document.createElement("button");
  button.id = "refresh";
  button.innerText = "Refresh headlines";
  button.addEventListener("click", () => {
    location.reload();
  });
  header.append(button);
}

function showFullStory(e) {
  console.log(e.target.parentElement.getAttribute("title"));
  // Make the headlines view invisible
  storiesContainer.classList.add("no-display");
  // Make the full story view visible
  storyContainer.classList.remove("no-display");
  // Make the refresh button invisible
  document.getElementById("refresh").classList.add("no-display");

  // Create the HTML for the full story view
  // using the data saved as attributes
  storyContainer.innerHTML = `
            <h2>${e.target.parentElement.getAttribute("title")}</h2>
            <span class="author">By ${e.target.parentElement.getAttribute(
              "author"
            )}</span>
            <article>
                ${e.target.parentElement.getAttribute("img")}
                ${e.target.parentElement.getAttribute("body")}
            </article>
            `;
  // Create a return button to return to headlines view
  let returnButton = document.createElement("button");
  returnButton.innerText = "Return to headlines";
  returnButton.id = "return";

  // Clear story and make headlines appear again
  returnButton.addEventListener("click", () => {
    // Clear storyContainer and make invisible
    storyContainer.innerHTML = "";
    storyContainer.classList.add("no-display");
    // Make headlines view visible again
    storiesContainer.classList.remove("no-display");
    // Make the refresh button visible again
    document.getElementById("refresh").classList.remove("no-display");
    // Remove the return button
    document.getElementById("return").remove();
  });

  // Append return button to header
  header.append(returnButton);

  // Makes sure user starts from top of story
  window.scrollTo(0, 0);
}
