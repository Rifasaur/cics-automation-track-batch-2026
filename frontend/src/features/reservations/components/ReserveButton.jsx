import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import Modal from '../../../shared/components/Modal';
import { getCurrentUser } from '../../../data/services/authService';
import { createReservation } from '../../../data/services/reservationService';
import { ROOMS, TIME_SLOTS } from '../../../data/mock/mockData';
import './ReserveButton.css';

export default function ReserveButton({ isAvailable = true, onClick = null, role = 'student' }) {
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [formData, setFormData] = useState({
		date: new Date().toISOString().slice(0, 10),
		timeSlot: TIME_SLOTS[0]?.id ?? '',
		roomId: ROOMS[0]?.id ?? '',
		notes: '',
	});
	const [submitMessage, setSubmitMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		let active = true;

		async function loadUser() {
			const user = await getCurrentUser();
			if (!active) return;
			setCurrentUser(user);
		}

		loadUser();

		return () => {
			active = false;
		};
	}, []);

	const selectedRoom = useMemo(
		() => ROOMS.find((room) => room.id === formData.roomId) ?? ROOMS[0] ?? null,
		[formData.roomId]
	);

	function handleClick(event) {
		if (onClick) {
			onClick(event);
			return;
		}

		setIsModalOpen(true);
		setSubmitMessage('');
	}

	function handleChange(key, value) {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (!currentUser) {
			setSubmitMessage('Please wait while we load your account.');
			return;
		}

		setIsSubmitting(true);
		setSubmitMessage('Submitting reservation...');

		try {
			const createdReservation = await createReservation({
				userId: currentUser.id,
				roomId: formData.roomId,
				date: formData.date,
				slotIds: [formData.timeSlot],
				notes: formData.notes,
			});

			setSubmitMessage(`Reservation created successfully: ${createdReservation.id}`);
		} catch (error) {
			setSubmitMessage('Unable to create reservation right now. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<Button
				className="reserve-fab"
				onClick={handleClick}
				disabled={!isAvailable}
				aria-label={isAvailable ? 'Reserve a slot' : 'No slots available'}
				style={{
					width: 'auto',
				}}
			>
				<div className="fab-wrapper">
					<span className="reserve-fab__icon" aria-hidden="true">
						<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
							<path d="M12 5v14M5 12h14" />
						</svg>
					</span>

					<span className="reserve-fab__label">{isAvailable ? 'Reserve' : 'Full'}</span>
				</div>
			</Button>

			<Modal
				isOpen={isModalOpen}
				title="Reserve a Slot"
				onClose={() => setIsModalOpen(false)}
			>
				<form className="reserve-modal-form" onSubmit={handleSubmit}>
					<div className="reserve-modal-form__summary">
						<p>Booking for: <strong>{currentUser?.name ?? 'Current user'}</strong></p>
						<p>Role: <strong>{role}</strong></p>
					</div>

					<label className="reserve-modal-field">
						<span>Date</span>
						<input type="date" value={formData.date} onChange={(event) => handleChange('date', event.target.value)} required />
					</label>

					<label className="reserve-modal-field">
						<span>Time Slot</span>
						<select value={formData.timeSlot} onChange={(event) => handleChange('timeSlot', event.target.value)}>
							{TIME_SLOTS.map((slot) => (
								<option key={slot.id} value={slot.id}>
									{slot.start} - {slot.end}
								</option>
							))}
						</select>
					</label>

					<label className="reserve-modal-field">
						<span>Room</span>
						<select value={formData.roomId} onChange={(event) => handleChange('roomId', event.target.value)}>
							{ROOMS.map((room) => (
								<option key={room.id} value={room.id}>
									{room.name}
								</option>
							))}
						</select>
					</label>

					<label className="reserve-modal-field">
						<span>Notes</span>
						<textarea
							rows="4"
							value={formData.notes}
							onChange={(event) => handleChange('notes', event.target.value)}
							placeholder="Optional message for your reservation"
						/>
					</label>

					<div className="reserve-modal-form__meta">
						<span>Selected room capacity: {selectedRoom?.capacity ?? 0}</span>
						<span>Available now: {isAvailable ? 'Yes' : 'No'}</span>
					</div>

					<div className="reserve-modal-form__actions">
						<button type="button" className="reserve-modal-form__secondary" onClick={() => setIsModalOpen(false)}>
							Cancel
						</button>
						<button type="submit" className="reserve-modal-form__primary" disabled={!isAvailable || isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Confirm Reservation'}
						</button>
					</div>

					{submitMessage ? <p className="reserve-modal-form__message">{submitMessage}</p> : null}
				</form>
			</Modal>
		</>
	);
}
