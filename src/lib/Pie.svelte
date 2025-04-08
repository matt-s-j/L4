<script>

    import * as d3 from "d3";

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    
    export let data =[]; // Data prop to be passed from the parent component


    let colors = d3.scaleOrdinal(d3.schemeTableau10)
    let sliceGenerator = d3.pie().value(d => d.value);

    let arcData;
    let arcs;

    $: {
        arcData = sliceGenerator(data);
        arcs = arcData.map(d => arcGenerator(d));
    }

    let arc = arcGenerator({
        startAngle: 0,
        endAngle: 2*Math.PI,
    });

    export let selectedIndex = -1;
</script>

<p>
    Hello From Pie.svelte
</p>

<div class = "container">
    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, i}
            <path d={arc} fill={colors(i)}
                class:selected={selectedIndex === i}
                on:click={e => selectedIndex = selectedIndex === i ? -1 : i} />
        {/each}
    </svg>

    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }"
                class:selected={selectedIndex === index}
                on:click={e => selectedIndex = selectedIndex === index ? -1 : index}>
                <span class="swatch"></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>
</div>

<style>
    .container {
        display: flex;
    }

    svg {
        max-width: 20em;
        margin-block: 2em;

        /* Do not clip shapes outside the viewBox */
        overflow: visible;
    }

    svg:has(path:hover) path:not(:hover) {
        opacity: 50%;
    }

    svg:has(.selected) path:not(.selected) {
   opacity: 50%;
    }

    .selected {
        --color: oklch(60% 70% 0) !important;
        
        &:is(path) {
            fill: var(--color) !important;
        }
        
        &:is(li) {
            color: var(--color);
        }
    }

    ul:has(.selected) li:not(.selected) {
        color: gray;
    }

    path {
        transition: 300ms;
        cursor: pointer;
    }

    .swatch{
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        background-color: var(--color);
    }

    .legend {
        border: 1px solid black;
        padding: 1em;
        margin: 1em;
        flex: 1;
    }

    ul {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(8em,1fr));
        gap: 1em;
    }

    li {
        display: flex;
        align-items: center;
        gap: 1em;

    }

</style>