<script lang="ts">
	import { onMount } from 'svelte';
	import { order_details } from '../actions';
	import type { OrderFull } from '../types';
	import { format_amount } from '$liwe3/utils/utils';

	interface Props {
		id: string;
	}

	let { id: id_order }: Props = $props();
	let order: OrderFull | null = $state(null);

	onMount(async () => {
		const res = await order_details(id_order);

		if (res.error) return;

		order = res;
	});
</script>

{#if order}
	<table>
		<tbody>
			<tr>
				<td class="tit">Code</td>
				<td>{order.code}</td>
				<td class="tit">Date</td>
				<td>{order.created}</td>
				<td class="tit">Status</td>
				<td>{order.status}</td>
			</tr>
			<tr>
				<td class="tit">Payment mode</td>
				<td>{order.payment_mode}</td>
				<td class="tit">Payment status</td>
				<td>{order.payment_status}</td>
			</tr>
			<tr>
				<td class="tit">Address</td>
				<td colspan="5"><pre>{order.address.addr}</pre></td>
			</tr>
			<tr>
				<td class="tit">Notes</td>
				<td colspan="5"><pre>{order.notes}</pre></td>
			</tr>
			<tr>
				<td colspan="6">
					<table>
						<thead>
							<tr>
								<th>Code</th>
								<th>Name</th>
								<th>Quantity</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{#each order.items as item}
								<tr>
									<td class="sub">{item.prod_code}</td>
									<td class="sub">{item.name}</td>
									<td class="sub cent">{item.quant}</td>
									<td class="sub num">{format_amount(item.total_vat)} ek</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
{/if}

<style>
	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 15px;
	}

	td {
		border: 1px solid #ddd;
		padding: 4px;
	}

	.tit {
		text-align: right;
		font-weight: bold;
		border: 0 !important;
		vertical-align: top;
	}

	.sub {
		border: 0;
		border-bottom: 1px solid #ddd;
	}

	.num {
		text-align: right;
	}

	.cent {
		text-align: center;
	}
</style>
