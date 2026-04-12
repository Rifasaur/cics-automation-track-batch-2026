import { useEffect, useState } from 'react';
import { getAllReservations } from '../../data/services/reservationService';
import PageHeader from '../../shared/components/PageHeader';
import '../../features/reservations/components/ReservationsTable.css';
import './PendingRequests.css';

export default function PendingRequests() {
	const tableHeaders = ['Request ID', 'Student', 'Date', 'Time Slot(s)', 'Actions'];
	const [pendingReservations, setPendingReservations] = useState([]);
	const [statusMessage, setStatusMessage] = useState('');

	useEffect(() => {
		let active = true;

		async function loadPendingReservations() {
			const reservations = await getAllReservations();

			if (!active) return;

			setPendingReservations(
				reservations.filter((reservation) => reservation.status === 'pending')
			);
		}

		loadPendingReservations();

		return () => {
			active = false;
		};
	}, []);

	function handleAction(action, reservationId) {
		setStatusMessage(`${action} queued for ${reservationId}.`);
		// TODO(backend): Replace this local message with a PATCH call
		// to /api/reservations/:id to approve/decline/reschedule pending requests.
	}

	return (
		<section className="dashboard-page">
			<PageHeader
				title="Pending Requests"
				subtitle="Approve or decline requests submitted by students."
			/>
			<div className="reservations-table">
				<div className="reservations-table__header">
					<div>
						<div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
							Pending Queue
						</div>
						<div style={{ marginTop: '0.35rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
							{statusMessage || 'Review, approve, or decline requests submitted by students.'}
						</div>
					</div>
					<div className="reservations-table__controls">
						<div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
							{pendingReservations.length} request{pendingReservations.length === 1 ? '' : 's'} pending
						</div>
					</div>
				</div>

				<div className="reservations-table__wrapper">
					<table className="reservations-table__table">
						<thead>
							<tr className="table-header-row">
								{tableHeaders.map((header) => (
									<th key={header} className="table-header-cell">
										{header.toUpperCase()}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{pendingReservations.map((reservation) => (
								<tr key={reservation.id} className="table-body-row">
									<td className="table-cell">
										<div className="user-name">{reservation.id}</div>
									</td>
									<td className="table-cell">
										<div className="user-name">{reservation.userName}</div>
									</td>
									<td className="table-cell">
										<div className="date">{reservation.date}</div>
									</td>
									<td className="table-cell">
										<div className="time">{reservation.slotIds.join(', ')}</div>
									</td>
									<td className="table-cell">
										<div className="pending-requests__actions">
											<button type="button" className="pending-requests__action-btn" onClick={() => handleAction('Approve', reservation.id)}>
												Approve
											</button>
											<button type="button" className="pending-requests__action-btn" onClick={() => handleAction('Decline', reservation.id)}>
												Decline
											</button>
										</div>
									</td>
								</tr>
							))}
							{pendingReservations.length === 0 ? (
								<tr className="table-body-row">
									<td className="table-cell" colSpan={tableHeaders.length}>
										No pending requests right now.
									</td>
								</tr>
							) : null}
						</tbody>
					</table>
				</div>

				<div className="reservations-table__footer">
					<div className="pagination-info">
						Displaying {pendingReservations.length} pending request{pendingReservations.length === 1 ? '' : 's'}
					</div>
					<div className="pagination-controls" aria-hidden="true">
						<span className="pagination-btn" style={{ opacity: 0.35 }}>‹</span>
						<span className="pagination-btn">›</span>
					</div>
				</div>
			</div>
		</section>
	);
}
