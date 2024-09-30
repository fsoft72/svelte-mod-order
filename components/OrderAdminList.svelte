<script lang="ts">
	import { onMount } from 'svelte';

	import DataGrid, {
		type DataGridField,
		type DataGridRow,
		type DataGridAction,
		type DataGridButton
	} from '$liwe3/components/DataGrid.svelte';
	import { Eye, Printer } from 'svelte-hero-icons';
	import { order_admin_list } from '../actions';
	import { runeDebug } from '$liwe3/utils/runes.svelte';
	import { format_amount } from '$liwe3/utils/utils';
	import Modal from '$liwe3/components/Modal.svelte';
	import OrderDetails from './OrderDetails.svelte';
	import Button from '$liwe3/components/Button.svelte';
	import { goto } from '$app/navigation';

	const fields: DataGridField[] = [
		{
			name: 'code',
			label: 'Code',
			type: 'text',
			sortable: true
		},
		{
			name: 'user',
			label: 'User',
			type: 'text',
			render: (row: DataGridRow) => {
				return `${row.name} ${row.lastname} ${row.email}`;
			}
		},
		{
			name: 'status',
			label: 'Status',
			type: 'text',
			sortable: true,
			filterable: true
		},
		{
			name: 'num_items',
			label: 'Items',
			type: 'number',
			sortable: true,
			align: 'right'
		},
		{
			name: 'total_vat',
			label: 'Total',
			type: 'text',
			sortable: true,
			align: 'right',
			render: (v: number) => {
				return `${format_amount(v)} ek`;
			}
		}
	];
	const actions: DataGridAction[] = [
		{
			label: 'details',
			icon: Eye,
			mode: 'mode1',
			action: (row: DataGridRow) => {
				currRow = row;
				modalDetails = true;
			}
		},
		{
			label: 'print',
			icon: Printer,
			mode: 'mode2',
			action: (row: DataGridRow) => {
				goto(`/admin/order/print/${row.id}`);
			}
		}
	];
	const buttons: DataGridButton[] = [];

	let data: any[] = $state([]);
	let currRow: DataGridRow | null = $state(null);
	let modalDetails: boolean = $state(false);

	onMount(async () => {
		const res = await order_admin_list();

		if (res.error) return;

		data = res;

		runeDebug(data);
	});
</script>

<DataGrid title="Orders" {fields} {data} {actions} {buttons} />

{#if modalDetails && currRow}
	<Modal
		title="Order details"
		onclose={() => (modalDetails = false)}
		oncancel={() => (modalDetails = false)}
	>
		<OrderDetails id={currRow.id} />
		<div class="order-buttons">
			<Button>Prepare</Button>
		</div>
	</Modal>
{/if}

<style>
	.order-buttons {
		display: flex;
		justify-content: space-between;

		border-top: 1px solid black;
		padding: 10px 0;
	}
</style>
