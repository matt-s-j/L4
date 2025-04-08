<script>
    export let data = {};
    export let hLevel = 2; // Default to h2 if not provided
</script>

<article>
    <svelte:element this={"h" + hLevel}>{data.title}</svelte:element>
    <img src={data.image} alt={data.title} />
    <p>{data.description}</p>
    <a href={data.link} target="_blank">View Project</a>
</article>

<style>
article {
    grid-template-rows: subgrid;
    grid-row: span 3;
}

article h2 {
    margin: 0;
}
</style>