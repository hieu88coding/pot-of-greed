<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import HelperText from '@smui/textfield/helper-text';
	import ChipInput from '@smui-extra/chip-input';
	import Slider from '@smui/slider';
	import { typeCard, attributeCard, raceCard } from '$lib/types/constants';
	import Button, { Label } from '@smui/button';
	import Select, { Option } from '@smui/select';
	import { goto } from '$app/navigation';

	let sortOptions = ['atk', 'def', 'name', 'type', 'level'];

	let sortValue = $state('');
	//atk slider
	let atkStart = $state(0);
	let atkEnd = $state(6000);

	//def slider
	let defStart = $state(0);
	let defEnd = $state(6000);

	//chips input
	let type = $state([]);
	let race = $state([]);
	let attribute = $state([]);
	let typeValue = $state('');
	let raceValue = $state('');
	let attributeValue = $state('');

	//input
	let name = $state('');
	let level = $state(1);

	//table data
	let data = $props();
	console.log('data in page', data);

	function handleSearch() {
		const params = new URLSearchParams();

		// Chỉ thêm các trường có giá trị khác rỗng hoặc khác mặc định
		if (sortValue !== '') params.set('sort', sortValue); // Bỏ qua nếu là giá trị mặc định
		if (atkStart !== 0) params.set('atkStart', atkStart.toString());
		if (atkEnd !== 6000) params.set('atkEnd', atkEnd.toString());
		if (defStart !== 0) params.set('defStart', defStart.toString());
		if (defEnd !== 6000) params.set('defEnd', defEnd.toString());
		if (type.length > 0) params.set('type', type.join(','));
		if (race.length > 0) params.set('race', race.join(','));
		if (attribute.length > 0) params.set('attribute', attribute.join(','));
		if (name) params.set('name', name); // Chỉ thêm nếu name không rỗng
		if (level !== 1) params.set('level', level.toString()); // Chỉ thêm nếu level không rỗng

		// Điều hướng đến URL với query params (nếu có)
		const queryString = params.toString();
		goto(queryString ? `/?${queryString}` : '/', { replaceState: true });
	}
</script>

<div class="flex flex-row gap-1.5">
	<div>
		<Textfield bind:value={name} label="Name">
			{#snippet helper()}
				<HelperText>Card name</HelperText>
			{/snippet}
		</Textfield>
	</div>
</div>

<div>
	<div>Level:</div>
	<Slider
		bind:level
		min={1}
		max={12}
		step={1}
		discrete
		tickMarks
		input$aria-label="Tick mark slider"
	/>
	<pre class="status">Value: {level}</pre>
</div>

<div>
	<div>Attack point:</div>
	<Slider
		range
		bind:start={atkStart}
		bind:end={atkEnd}
		min={0}
		max={6000}
		step={500}
		minRange={500}
		discrete
		tickMarks
		input$aria-label="Range slider"
	/>
	<pre class="status">Value: {atkStart} - {atkEnd}</pre>
</div>

<div>
	<div>Defence point:</div>
	<Slider
		range
		bind:start={defStart}
		bind:end={defEnd}
		min={0}
		max={6000}
		step={500}
		minRange={500}
		discrete
		tickMarks
		input$aria-label="Range slider"
	/>
	<pre class="status">Value: {defStart} - {defEnd}</pre>
</div>

<div>
	<ChipInput
		bind:chips={type}
		bind:typeValue
		chipTrailingAction$class="material-icons"
		chipTrailingAction$aria-label="Remove category"
		autocomplete$options={typeCard.filter((category) => !type.find((cat) => cat === category))}
		autocomplete$showMenuWithNoInput
	>
		{#snippet chipTrailingAction()}cancel{/snippet}
		{#snippet label()}
			Type
		{/snippet}
	</ChipInput>
</div>

<div>
	<ChipInput
		bind:chips={race}
		bind:raceValue
		chipTrailingAction$class="material-icons"
		chipTrailingAction$aria-label="Remove category"
		autocomplete$options={raceCard.filter((category) => !type.find((cat) => cat === category))}
		autocomplete$showMenuWithNoInput
	>
		{#snippet chipTrailingAction()}cancel{/snippet}
		{#snippet label()}
			Race
		{/snippet}
	</ChipInput>
</div>

<div>
	<ChipInput
		bind:chips={attribute}
		bind:attributeValue
		chipTrailingAction$class="material-icons"
		chipTrailingAction$aria-label="Remove category"
		autocomplete$options={attributeCard.filter((category) => !type.find((cat) => cat === category))}
		autocomplete$showMenuWithNoInput
	>
		{#snippet chipTrailingAction()}cancel{/snippet}
		{#snippet label()}
			Attribute
		{/snippet}
	</ChipInput>
</div>

<div class="columns margins" style="justify-content: flex-start;">
	<div>
		<Select bind:sortValue label="Select Menu">
			{#each sortOptions as fruit}
				<Option value={fruit}>{fruit}</Option>
			{/each}
		</Select>

		<pre class="status">Selected: {sortValue}</pre>
	</div>
</div>

<Button onclick={() => handleSearch()} variant="raised">
	<Label>Search</Label>
</Button>
<Table {data} />

<style lang="postcss">
	@reference "tailwindcss";
	:global(html) {
		background-color: theme(--color-gray-100);
	}
</style>
