<script>
    import {page} from '$app/stores';
    import { onMount } from 'svelte';
    let pages = [
    {url: "./", title: "Home"},
    {url: "./projects", title: "Projects"},
    {url: "./contacts", title: "Contacts"},
    ]

    onMount(() => {
        // Check if the user has a preferred color scheme in localStorage
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
    });
</script>

<nav>
    {#each pages as p}
    <a href="{p.url}" class:current={"." + $page.route.id ===p.url}>{p.title}</a>
    {/each}
</nav>

YOLO <slot />

<style>
:root {
    --color--accent: #4a90e2;
}

html {
    color-scheme: dark light;
}

body {
    font-family: Arial, sans-serif;
    margin: 10;
    padding: 10ch;
    font: 100%/1.5 system-ui, sans-serif;
    max-width: 100ch;
    margin-inline: auto;
    accent-color: var(--color--accent);
}

nav {
    text-align: center;
    display: flex;
    padding: .5em;
    margin-bottom: 1em;
    border-bottom: #c5bcbc 1px solid;
}

nav a {
    text-decoration: none;
    padding: 10px 20px;
    display: block;
    flex: 1;
}
nav a:hover {
    background-color: var(--color--accent);
    color: white;
}

nav ul{
    display: contents;
}

nav li {
    list-style: none;
}

.current {
    background-color: #ada9a9;
    color: white;
}
</style>