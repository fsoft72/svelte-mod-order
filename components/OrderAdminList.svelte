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
	import { OrderStatus } from '../types';

	const fields: DataGridField[] = [
		{
			name: 'code',
			label: 'Code',
			type: 'text',
			sortable: true,
			filterable: true
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
			filterable: true,
			options: {
				filterSelect: [
					{
						value: OrderStatus.ready,
						label: 'Ready'
					},
					{
						value: OrderStatus.in_progress,
						label: 'In Progress'
					},
					{
						value: OrderStatus.to_deliver,
						label: 'To Deliver'
					},
					{
						value: OrderStatus.completed,
						label: 'Completed'
					},
					{
						value: OrderStatus.paid,
						label: 'Paid'
					},
					{
						value: OrderStatus.new,
						label: 'New'
					},
					{
						value: OrderStatus.cancelled,
						label: 'Cancelled'
					}
				]
			}
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
			label: 'Paid',
			type: 'checkbox',
			checked: true,
			onclick: (checked: boolean = true) => {
				showStatuses.paid = checked;
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
		paid: true,
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

	const orderStatus = async (status: string) => {
		if (!currRow) return;
		await order_change_status(currRow.id, status);
		modalDetails = false;

		// update the data array
		data = data.map((row) => {
			if (row.id === currRow!.id) {
				return {
					...row,
					status
				};
			}

			return row;
		});
	};

	onMount(async () => {
		const res = await order_admin_list();

		if (res.error) return;

		data = res;
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
			{#if currRow.status === 'paid'}
				<Button onclick={() => orderStatus('in_progress')}>Prepare</Button>
			{/if}
			{#if currRow.status === 'ready'}
				<Button onclick={() => orderStatus('in_progress')}>Prepare</Button>
				<Button mode="mode2" onclick={() => orderStatus('to_deliver')}>To Deliver</Button>
				<Button mode="mode4" onclick={() => orderStatus('completed')}>Completed</Button>
			{/if}
			{#if currRow.status === 'in_progress'}
				<Button onclick={() => orderStatus('ready')}>Ready</Button>
				<Button mode="mode2" onclick={() => orderStatus('to_deliver')}>To Deliver</Button>
			{/if}
			{#if currRow.status === 'to_deliver'}
				<Button onclick={() => orderStatus('in_progress')}>Prepare</Button>
				<Button mode="mode4" onclick={() => orderStatus('completed')}>Completed</Button>
			{/if}
		</div>
	</Modal>
{/if}

<style>
	.order-buttons {
		display: flex;
		justify-content: flex-start;
		gap: 2rem;

		border-top: 1px solid black;
		padding: 10px 0;
	}
</style>
