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
	const [submittedReservation, setSubmittedReservation] = useState(null);

	const todayStr = new Date().toISOString().slice(0, 10);

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
		setSubmittedReservation(null);
	}

	function handleClose() {
		setIsModalOpen(false);
		setSubmittedReservation(null);
		setSubmitMessage('');
	}

	function handleMakeAnother() {
		setSubmittedReservation(null);
		setSubmitMessage('');
		setFormData({
			date: new Date().toISOString().slice(0, 10),
			timeSlot: TIME_SLOTS[0]?.id ?? '',
			roomId: ROOMS[0]?.id ?? '',
			notes: '',
		});
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
		setSubmitMessage('');

		try {
			const createdReservation = await createReservation({
				userId: currentUser.id,
				roomId: formData.roomId,
				date: formData.date,
				slotIds: [formData.timeSlot],
				notes: formData.notes,
			});

			setSubmittedReservation(createdReservation);
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
				onClose={handleClose}
			>
				{submittedReservation ? (
					<div className="reserve-success">
						<div className="reserve-success__icon" aria-hidden="true">✓</div>
						<h3 className="reserve-success__title">Reservation Submitted!</h3>
						<p className="reserve-success__detail">
							<strong>{submittedReservation.roomName}</strong>
						</p>
						<p className="reserve-success__detail">
							{new Date(submittedReservation.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
						</p>
						{submittedReservation.slotIds?.length > 0 && (
							<p className="reserve-success__detail">
								{TIME_SLOTS.find(s => s.id === submittedReservation.slotIds[0])?.start} –{' '}
								{TIME_SLOTS.find(s => s.id === submittedReservation.slotIds[submittedReservation.slotIds.length - 1])?.end}
							</p>
						)}
						<p className="reserve-success__ref">Ref: {submittedReservation.id}</p>
						<div className="reserve-modal-form__actions" style={{ marginTop: '1.5rem' }}>
							<button type="button" className="reserve-modal-form__secondary" onClick={handleMakeAnother}>
								Make Another
							</button>
							<button type="button" className="reserve-modal-form__primary" onClick={handleClose}>
								Close
							</button>
						</div>
					</div>
				) : (
				<form className="reserve-modal-form" onSubmit={handleSubmit}>
					<div className="reserve-modal-form__summary">
                        <div className="booking-rules" padding="lg" elevated>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Booking Rules</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#595959', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Reservation Hours</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>08:00 AM - 05:00 PM</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#595959', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Max Stay</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>3 hours</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#595959', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Grace Period</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>15 minutes</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#595959', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Occupancy Length</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>1 hour (Hourly Basis)</span>
                                </div>
                            </div>
                        </div>
					</div>

					<label className="reserve-modal-field">
						<span>Date</span>
						<input type="date" value={formData.date} min={todayStr} onChange={(event) => handleChange('date', event.target.value)} required />
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
						<button type="button" className="reserve-modal-form__secondary" onClick={handleClose}>
							Cancel
						</button>
						<button type="submit" className="reserve-modal-form__primary" disabled={!isAvailable || isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Confirm Reservation'}
						</button>
					</div>

					{submitMessage ? <p className="reserve-modal-form__message reserve-modal-form__message--error">{submitMessage}</p> : null}
				</form>
				)}
			</Modal>
		</>
	);
}
