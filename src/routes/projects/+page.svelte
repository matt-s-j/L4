<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
    import Pie from "$lib/Pie.svelte";
    import * as d3 from "d3";

    // Search function
    let query = "";
    $: filteredProjects = projects.filter(project => {
        let values = Object.values(project).join("\n").toLowerCase();

        return values.includes(query.toLowerCase());
    });

    // Pie Data
    let pieData;
        $: {
            // Initialize an empty object
            pieData = {};

            // Calculate rolled Data
            let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);

            // Assign rolledData to pieData
            pieData = rolledData.map(([year, count]) => {
                return { value: count, label: year };
            });
        }
    
    // Data filtering based on selectedIndex
    let selectedYearIndex = -1;

    let selectedYear;
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

    let filteredByYear = filteredProjects;
    $: filteredByYear = filteredProjects.filter(project => {
        if (selectedYear) {
            return project.year === selectedYear;
        } else {
            return true; // No filter applied
        }
    });
    


</script>

<svelte:head>
    <title>Projects</title>
</svelte:head>


<body>
    <h1>{projects.length} Projects</h1>
    <input type="search" bind:value={query} aria-label="Search Projects" placeholder="🔍 Search projects…" />
    <Pie data={pieData} bind:selectedIndex={selectedYearIndex} />
    <p>Selected Year: {selectedYearIndex === -1 ? "None" : selectedYear}</p>
    <div class="projects">
        {#each filteredByYear as project}
            <Project data={project} />
        {/each}
    </div>
</body>

<style>
    input {
        width: 100%;
    }
</style>