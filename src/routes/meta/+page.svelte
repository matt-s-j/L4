<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";

    let width = 1000, height = 600;
    let margin = {top: 20, right: 30, bottom: 30, left: 40};
    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;

    //Data
    let data = [];
    let commits = [];

    onMount(async () => {
        data = await d3.csv("/loc.csv", row => ({
            ...row,
            line: Number(row.line),
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + "T00:00" + row.timezone),
            datetime: new Date(row.datetime)
        }));
        commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
            let first = lines[0];
            let {author, date, time, timezone, datetime} = first;
            let ret = {
                id: commit,
                url: "https://github.com/vis-society/lab-7/commit/" + commit,
                author, date, time, timezone, datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length,
            };

            Object.defineProperty(ret, "lines", {
                value: lines,
                configurable: true,
                writable: true,
                enumerable: false,
        });

        return ret;
        });
        console.log(commits);
    });

    $: minDate = d3.min(commits.map(d => d.date));
    $: maxDate = d3.max(commits.map(d => d.date));
    $: maxDatePlusOne = new Date(maxDate);
    $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

    $: xScale = d3.scaleTime()
                .domain([minDate, maxDatePlusOne])
                .range([usableArea.left, usableArea.right])
                .nice();

    $: yScale = d3.scaleLinear()
                .domain([24, 0])
                .range([usableArea.top, usableArea.bottom])
                .nice();
    let xAxis, yAxis;

    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
    }

</script>



<svelte:head>
    <title>Meta</title>
</svelte:head>

<p>
    Hello From Meta.svelte
</p>

<dl class="stats">
	<dt>Total <abbr title="Lines of code">LOC</abbr></dt>
	<dd>{data.length}</dd>
</dl>

<svg viewBox="0 0 {width} {height}">
    <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
    <g class="dots">
        {#each commits as commit, index}
            <circle
                cx={xScale(commit.datetime)}
                cy={yScale(commit.hourFrac)}
                r="5"
                fill="steelblue"
            />
        {/each}
    </g>
</svg>


<style>
    svg {
        overflow: visible;
    }
</style>