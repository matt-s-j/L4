<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
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
    
    <h2> Latest Projects</h2>
    <div class="projects">
        {#each projects.slice(0,3) as project}
            <Project data={project} hLevel="3" />
        {/each}

</body>