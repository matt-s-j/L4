console.log("This is a global script.");

function $$ (selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");



// let navlinks = $$("nav a");
// let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);

// if (currentLink) {
//   currentLink?.classList.add("current");
// }

let pages = [
  {url: "./", title: "Home"},
  {url: "/projects", title: "Projects"},
  {url: "/contacts", title: "Contacts"},
]

let nav = document.createElement("nav");

document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  console.log(url, title, ARE_WE_HOME);

  if (!ARE_WE_HOME && !url.startsWith("http")) {
    url = "./" + url;
  }
  console.log(url, title, ARE_WE_HOME);
  
  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }
  nav.append(a);
}

document.body.insertAdjacentHTML("afterbegin", `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="dark light">Auto</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`);

let select = document.querySelector(".color-scheme select");

select.addEventListener("input", function (e) {
  console.log("color-scheme", e.target.value);
  document.documentElement.style.setProperty("color-scheme", select.value);
  localStorage.colorScheme = e.target.value;
});

if (localStorage.colorScheme) {
  document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}