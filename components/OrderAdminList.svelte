<script lang="ts">
	import { onMount } from 'svelte';

	import DataGrid, {
		type DataGridField,
		type DataGridRow,
		type DataGridAction,
		type DataGridButton
	} from '$liwe3/components/DataGrid.svelte';
	import { Eye, Printer } from 'svelte-hero-icons';
	import { order_admin_list, order_change_status } from '../actions';
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
			onclick: (row: DataGridRow) => {
				currRow = row;
				modalDetails = true;
			}
		},
		{
			label: 'print',
			icon: Printer,
			mode: 'mode2',
			onclick: (row: DataGridRow) => {
				goto(`/admin/order/print/${row.id}`);
			}
		}
	];
	const buttons: DataGridButton[] = [
		{
			label: 'New',
			type: 'checkbox',
			checked: false,
			onclick: (checked: boolean = true) => {
				showStatuses.new = checked;
			}
		},
		{
			label: 'In Progress',
			type: 'checkbox',
			checked: true,
			onclick: (checked: boolean = true) => {
				showStatuses.in_progress = checked;
			}
		},
		{
			label: 'Ready',
			type: 'checkbox',
			checked: true,
			onclick: (checked: boolean = true) => {
				showStatuses.ready = checked;
			}
		},
		{
			label: 'To deliver',
			type: 'checkbox',
			checked: false,
			onclick: (checked: boolean = true) => {
				showStatuses.to_deliver = checked;
			}
		},
		{
			label: 'Completed',
			type: 'checkbox',
			checked: false,
			onclick: (checked: boolean = true) => {
				showStatuses.completed = checked;
			}
		}
	];

	let data: any[] = $state([]);
	let currRow: DataGridRow | null = $state(null);
	let modalDetails: boolean = $state(false);

	let showStatuses: Record<string, boolean> = $state({
		new: false,
		in_progress: true,
		ready: true,
		to_deliver: false,
		completed: false
	});

	let rows = $derived.by(() => {
		// filter rows by status and remove the ones that are new
		// if showStatusNew is false
		return data.filter((row) => {
			return showStatuses[row.status];
		});
	});

	const orderPrepare = async () => {
		if (!currRow) return;
		await order_change_status(currRow.id, 'in_progress');
		modalDetails = false;

		// update the data array
		data = data.map((row) => {
			if (row.id === currRow!.id) {
				return {
					...row,
					status: 'in_progress'
				};
			}

			return row;
		});
	};

	onMount(async () => {
		const res = await order_admin_list();

		if (res.error) return;

		data = res;

		runeDebug(data);
	});
</script>

<DataGrid title="Orders" {fields} data={rows} {actions} {buttons} />

{#if modalDetails && currRow}
	<Modal
		title="Order details"
		onclose={() => (modalDetails = false)}
		oncancel={() => (modalDetails = false)}
	>
		<OrderDetails id={currRow.id} />
		<div class="order-buttons">
			{#if currRow.status === 'ready'}
				<Button onclick={orderPrepare}>Prepare</Button>
			{/if}
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
