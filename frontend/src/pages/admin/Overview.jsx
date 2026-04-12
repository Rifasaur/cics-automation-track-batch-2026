import { useEffect, useState } from 'react';
import { getUsers } from '../../data/services/authService';
import { getAllReservations } from '../../data/services/reservationService';
import PageHeader from '../../shared/components/PageHeader';

export default function Overview() {
	const [metrics, setMetrics] = useState(null);

	useEffect(() => {
		let active = true;

		async function loadMetrics() {
			const [users, reservations] = await Promise.all([getUsers(), getAllReservations()]);
			const activeCheckIns = reservations.filter((reservation) => reservation.status === 'checked_in').length;
			const availableSlots = reservations.filter((reservation) => reservation.status === 'confirmed').length;

			if (!active) return;

			setMetrics([
				{ label: 'Total Users', value: String(users.length) },
				{ label: 'Total Reservations', value: String(reservations.length) },
				{ label: 'Active Check-ins', value: String(activeCheckIns) },
				{ label: 'Confirmed Reservations', value: String(availableSlots) },
			]);
		}

		loadMetrics();

		return () => {
			active = false;
		};
	}, []);

	if (!metrics) {
		return <section className="dashboard-page">Loading admin overview...</section>;
	}

	return (
		<section className="dashboard-page">
			<PageHeader
				title="Admin Overview"
				subtitle="High-level operational snapshot for the learning commons."
			/>
			<div className="dashboard-page__metrics">
				{metrics.map((metric) => (
					<article key={metric.label}>
						<strong>{metric.label}</strong>
						<p>{metric.value}</p>
					</article>
				))}
			</div>
		</section>
	);
}
