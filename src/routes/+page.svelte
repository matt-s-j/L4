<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";

    import { onMount } from "svelte";

    let githubData = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const response = await fetch("https://api.github.com/users/matt-s-j");
            githubData = await response.json();
        } catch (err) {
            error = err;
        }
        loading = false;
    });
</script>

<body>
    <h1>Hi I'm Matthew Johnson</h1>
    <img src="./images/Headshot.jpeg" alt="Headshot photograph of Matthew Johnson" width="200" height="200">
    <p>
        Welcome to my personal webpage! I am a first year MS/MBA student at MIT.
        I am focused on the intersection of technology and business, with a particular interest in
        data science and machine learning. I have a background in computer science and have worked on
        various projects involving data analysis and software development.
    </p>
    
    {#if loading}
    <p>Loading...</p>
    {:else if error}
    <p class="error">Something went wrong: {error.message}</p>
    {:else}
        <section>
            <h2>My GitHub Stats</h2>
            <dl>
                <dt>Followers:</dt>
                <dd>{githubData.followers}</dd>
                <dt>Following:</dt>
                <dd>{githubData.following}</dd>
                <dt>Public Repositories:</dt>
                <dd>{githubData.public_repos}</dd>
            </dl>
        </section>
    {/if}
    
    <h2> Latest Projects</h2>
    <div class="projects">
        {#each projects.slice(0,3) as project}
            <Project data={project} hLevel="3" />
        {/each}

</body>