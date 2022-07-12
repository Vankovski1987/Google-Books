"use strict";

const form = document.querySelector("#form");
const search = document.querySelector("#search");
const imgDefault =
  "https://render.fineartamerica.com/images/rendered/medium/front/spiral-notebook/images-medium-5/the-mission-olivier-le-queinec.jpg?&targetx=-380&targety=0&imagewidth=1441&imageheight=961&modelwidth=680&modelheight=961&backgroundcolor=10161C&orientation=0&producttype=spiralnotebook";
const main = document.querySelector("main");
const btn = document.querySelector(".btn");
const toasts = document.querySelector("#toasts");

const getBooks = async function (search) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=search+${search}`
    );
    if (!res.ok) throw new Error("Problem getting books");
    const data = await res.json();
    if (!data.totalItems) throw new Error("Book not found!");
    displayBooks(data.items);
  } catch (err) {
    createNotification(err.message);
  }
};

const displayBooks = function (books) {
  main.innerHTML = "";

  books.forEach((book) => {
    const {
      language = "none",
      authors = "none",
      pageCount = 0,
      title = "none",
      description = "No description",
      imageLinks,
    } = book.volumeInfo;

    const bookEl = document.createElement("div");
    bookEl.classList.add("book");

    bookEl.innerHTML = `
    <img src=" ${imageLinks?.thumbnail || imgDefault} ";
    alt="">
    <div class="book-info">
      <h3>${title}</h3>
      <span>p.${pageCount} </span>
    </div>
    <div class="overview">
     ${description}
    </div>
    <div class="book-info">
          <h4>Author: ${authors}</h4>
          <span>lang: ${language} </span>
        </div>
    `;
    main.insertAdjacentElement("beforeend", bookEl);
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchVal = search.value;

  if (searchVal && searchVal !== "") {
    getBooks(searchVal);
    search.value = "";
  } else {
    createNotification("Type something!");
  }
});

btn.addEventListener("click", (e) => {
  const html = document.querySelector("html");
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    e.target.innerHTML = "Dark Mode";
  } else {
    html.classList.add("dark");
    e.target.innerHTML = "White Mode";
  }
});

function createNotification(msg = "Something went wrong!") {
  const not = document.createElement("div");
  not.classList.add("toast");
  not.innerText = msg;
  toasts.insertAdjacentElement("beforeend", not);

  setTimeout(() => {
    not.remove();
  }, 5000);
}
