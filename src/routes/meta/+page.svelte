<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    let data = [];

    onMount(async () => {
        data = await d3.csv("/loc.csv");
    });
</script>



<svelte:head>
    <title>Meta</title>
</svelte:head>

<p>
    Hello From Meta.svelte
    Total number of rows: {data.length}
</p>