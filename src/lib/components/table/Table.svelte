<!-- src/routes/+page.svelte -->
<script lang="ts">
	import DataTable, { Head, Body, Row, Cell, Pagination } from '@smui/data-table';
	import Select, { Option } from '@smui/select';
	import IconButton from '@smui/icon-button';
	import { Label } from '@smui/common';
	import type { CardType } from '$lib/types/card';
	// Nhận dữ liệu từ server thông qua prop 'data'
	let data = $props();
	console.log(data);
	// Sử dụng $state để quản lý trạng thái dữ liệu
	let items: CardType[] = $state(data.data.data.items);
	let perPage = $state(10);
	let currentPage = $state(0);
	// Tính toán phân trang
	console.log(items);

	const start = $derived(currentPage * perPage);
	const end = $derived(Math.min(start + perPage, items.length));
	console.log(items);

	const slice = $derived(items.slice(start, end));
	const lastPage = $derived(Math.max(Math.ceil(items.length / perPage) - 1, 0));

	// Điều chỉnh trang hiện tại nếu vượt quá lastPage
	$effect(() => {
		if (currentPage > lastPage) {
			currentPage = lastPage;
		}
	});
</script>

<DataTable table$aria-label="Todo list" style="width: 100%;">
	<Head>
		<Row>
			<Cell numeric>ID</Cell>
			<Cell style="width: 100%;">Title</Cell>
			<Cell>Completed</Cell>
			<Cell numeric>User ID</Cell>
		</Row>
	</Head>
	<Body>
		{#each slice as item (item.id)}
			<Row>
				<Cell numeric>{item.id}</Cell>
				<Cell>{item.name}</Cell>
				<Cell>{item.type}</Cell>
				<Cell>{item.desc}</Cell>
			</Row>
		{/each}
	</Body>

	{#snippet paginate()}
		<Pagination>
			{#snippet rowsPerPage()}
				<Label>Rows Per Page</Label>
				<Select variant="outlined" bind:value={perPage} noLabel>
					<Option value={10}>10</Option>
					<Option value={25}>25</Option>
					<Option value={100}>100</Option>
				</Select>
			{/snippet}
			{#snippet total()}
				{start + 1}-{end} of {items.length}
			{/snippet}

			<IconButton
				class="material-icons"
				action="first-page"
				title="First page"
				onclick={() => (currentPage = 0)}
				disabled={currentPage === 0}>first_page</IconButton
			>
			<IconButton
				class="material-icons"
				action="prev-page"
				title="Prev page"
				onclick={() => currentPage--}
				disabled={currentPage === 0}>chevron_left</IconButton
			>
			<IconButton
				class="material-icons"
				action="next-page"
				title="Next page"
				onclick={() => currentPage++}
				disabled={currentPage === lastPage}>chevron_right</IconButton
			>
			<IconButton
				class="material-icons"
				action="last-page"
				title="Last page"
				onclick={() => (currentPage = lastPage)}
				disabled={currentPage === lastPage}>last_page</IconButton
			>
		</Pagination>
	{/snippet}
</DataTable>
