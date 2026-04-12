// ============================================================
// Analytics Mock Data Generator
// Single source of truth for all analytics visualizations
// ============================================================

const ROOM_NAMES = [
	'Learning Commons',
];

const TIME_LABELS = [
	'08:00', '09:00', '10:00', '11:00', '12:00',
	'13:00', '14:00', '15:00', '16:00', '17:00',
];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Seeded-ish random for consistency within a session
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Simulate peak-hour weight (10AM–2PM higher usage)
function peakWeight(hour) {
	if (hour >= 10 && hour <= 14) return 1.6;
	if (hour >= 9 && hour <= 15) return 1.2;
	return 0.7;
}

// ── Generators by date-range filter ───────────────────────

function generateHourlyTrend(range) {
	const multiplier = range === 'month' ? 4.5 : range === 'week' ? 1 : 0.3;
	return TIME_LABELS.map((label, i) => {
		const hour = 8 + i;
		const base = Math.round(rand(18, 38) * peakWeight(hour) * multiplier);
		return { time: label, reservations: base };
	});
}

function generateDailyTrend(range) {
	const days = range === 'month' ? 30 : range === 'week' ? 7 : 1;
	if (days === 1) {
		return [{ day: 'Today', reservations: rand(40, 75) }];
	}
	const labels =
		days === 7
			? DAY_LABELS
			: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

	return labels.map((day) => ({
		day,
		reservations: rand(30, 90),
	}));
}

function generateRoomUtilization(range) {
	const multiplier = range === 'month' ? 5 : range === 'week' ? 1 : 0.2;
	return ROOM_NAMES.map((room) => ({
		room,
		reservations: Math.round(rand(20, 65) * multiplier),
	}));
}

function generateTimeSlotDistribution(range) {
	const multiplier = range === 'month' ? 4 : range === 'week' ? 1 : 0.3;
	return TIME_LABELS.map((slot, i) => {
		const hour = 8 + i;
		const w = peakWeight(hour);
		return {
			slot,
			students: Math.round(rand(8, 28) * w * multiplier),
			staff: Math.round(rand(2, 8) * w * multiplier),
		};
	});
}

function generateUserActivity() {
	return [
		{ name: 'Frequent (5+ / wk)', value: rand(22, 38) },
		{ name: 'Regular (2-4 / wk)', value: rand(25, 40) },
		{ name: 'Occasional (1 / wk)', value: rand(15, 25) },
		{ name: 'Rare (< 1 / wk)', value: rand(8, 18) },
	];
}

function generateKPIs(range) {
	const total = range === 'month' ? rand(620, 980) : range === 'week' ? rand(140, 260) : rand(25, 55);
	const peakHour = '10:00 AM – 12:00 PM';
	const topRoom = ROOM_NAMES[0];
	const activeUsers = rand(32, 78);

	return {
		totalReservations: { value: total, trend: `+${rand(5, 18)}%` },
		peakUsageTime: { value: peakHour, trend: null },
		mostReservedRoom: { value: topRoom, trend: null },
		activeUsers: { value: activeUsers, trend: `+${rand(2, 12)}%` },
	};
}

// ── Public API ────────────────────────────────────────────

export function generateAnalyticsData(range = 'week') {
	return {
		kpis: generateKPIs(range),
		hourlyTrend: generateHourlyTrend(range),
		dailyTrend: generateDailyTrend(range),
		roomUtilization: generateRoomUtilization(range),
		timeSlotDistribution: generateTimeSlotDistribution(range),
		userActivity: generateUserActivity(),
	};
}

export const CHART_COLORS = {
	primary: '#be152e',
	primaryLight: '#ff8888',
	secondary: '#c1a05c',
	secondaryLight: '#ffdea0',
	accent1: '#907334',
	accent2: '#5b4305',
	pie: ['#be152e', '#c1a05c', '#5f5e5e', '#907334'],
};
