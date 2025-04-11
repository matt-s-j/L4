<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import {
        computePosition,
        autoPlacement,
        offset,
        detectOverflow,
    } from "@floating-ui/dom";
    import Bar from "$lib/Bar.svelte";

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
    let xAxis, yAxis, yAxisGridlines;

    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
    }

    $: {
        d3.select(yAxisGridlines).call(
            d3.axisLeft(yScale)
            .tickFormat("")
            .tickSize(-usableArea.width)
        );
    }

    let hoveredIndex = -1;
    let hoveredCommit;
    $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};

    let cursor = {x: 0, y: 0};

    let clickedCommits = [];

    let commitTooltip;

    let tooltipPosition = {
        x: 0,
        y: 0,
    };

    async function dotInteraction(index, evt) {
        let hoveredDot = evt.target;
        if (evt.type === "mouseenter") {
            hoveredIndex = index;
            cursor = {
                x: evt.clientX,
                y: evt.clientY,
            };
            tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
                strategy: "fixed",
                middleware: [
                    offset(5),
                    autoPlacement(),
                ],
            });
        } else if (evt.type === "mouseleave") {
            hoveredIndex = -1;
        } else if (evt.type === "click") {
            let commit = commits[index]
            if (!clickedCommits.includes(commit)) {
                // Add the commit to the clickedCommits array
                clickedCommits = [...clickedCommits, commit];
            }
            else {
                    // Remove the commit from the array
                    clickedCommits = clickedCommits.filter(c => c !== commit);
            }
        }
    };

    $: allTypes = Array.from(new Set(data.map(d => d.type)));
    $: selectedLines = (clickedCommits.length > 0 ? clickedCommits : commits).flatMap(d => d.lines);
    $: selectedCounts = d3.rollup(selectedLines, v => v.length, d => d.type);
    $: languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);


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
    <g transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} class="gridlines" />
    <g class="dots">
        {#each commits as commit, index}
            <circle
                on:mouseenter={evt => dotInteraction(index, evt)}
                on:mouseleave={evt => dotInteraction(index, evt)}
                on:click={evt => dotInteraction(index, evt)}
                cx={xScale(commit.datetime)}
                cy={yScale(commit.hourFrac)}
                r="5"
                fill="steelblue"
                class:selected={clickedCommits.includes(commit)}
            />
        {/each}
    </g>
</svg>

<Bar data={languageBreakdown} width={width} />

<dl class="info_tooltip" bind:this={commitTooltip}>
	<dt>Commit</dt>
	<dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>

	<dt>Date</dt>
	<dd>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>
    <dt>Time</dt>
    <dd>{ hoveredCommit.datetime?.toLocaleString("en", {timeStyle: "short"}) }</dd>
    <dt>Author</dt>
    <dd>{ hoveredCommit.author }</dd>

</dl>


<style>
    svg {
        overflow: visible;
    }

    .gridlines {
        stroke-opacity: .2;
    }

    circle {
        transition: 200ms;
        transform-origin: center;
        transform-box: fill-box;

        &:hover {
            transform: scale(1.5);
        }
    }

    .selected {
        fill: orange;
    }

    .info_tooltip {
        display: grid;
        position: fixed;
        box-shadow: 1em 1em 1em rgba(0, 0, 0, .2);
        border-radius: 1em;
        backdrop-filter: blur(10px);
        padding: 1em;
        background-color: gray;

        transition-duration: 500ms;
        transition-property: opacity, visibility;
        

        &[hidden]:not(:hover, :focus-within) {
            opacity: 0;
            visibility: hidden;
        }
    }
</style>