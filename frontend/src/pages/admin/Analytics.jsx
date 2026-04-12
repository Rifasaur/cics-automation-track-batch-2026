import { useEffect, useState, useCallback } from 'react';
import {
	CalendarBlank,
	Clock,
	UsersThree,
	Export,
} from '@phosphor-icons/react';
import PageHeader from '../../shared/components/PageHeader';
import { generateAnalyticsData } from './analytics/analyticsData';
import KPICard from './analytics/KPICard';
import ReservationTrendChart from './analytics/ReservationTrendChart';
import TimeSlotChart from './analytics/TimeSlotChart';
import UserActivityChart from './analytics/UserActivityChart';
import SkeletonBlock from './analytics/SkeletonBlock';
import './analytics/Analytics.css';

const DATE_RANGES = [
	{ label: 'Today', value: 'today' },
	{ label: 'Week', value: 'week' },
	{ label: 'Month', value: 'month' },
];

export default function Analytics() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [range, setRange] = useState('week');

	const loadData = useCallback((selectedRange) => {
		setLoading(true);
		// Simulate network delay for skeleton loader UX
		const timer = setTimeout(() => {
			setData(generateAnalyticsData(selectedRange));
			setLoading(false);
		}, 1200);
		return timer;
	}, []);

	useEffect(() => {
		const timer = loadData(range);
		return () => clearTimeout(timer);
	}, [range, loadData]);

	function handleRangeChange(value) {
		setRange(value);
	}

	return (
		<section className="dashboard-page analytics-page">
			<div className="analytics-page__header">
				<PageHeader
					title="Analytics"
					subtitle="Reservation insights and capacity metrics for Learning Common Rooms."
				/>
				<div className="analytics-page__controls">
					<div className="analytics-filter-group">
						{DATE_RANGES.map((r) => (
							<button
								key={r.value}
								className={`analytics-filter-btn${range === r.value ? ' analytics-filter-btn--active' : ''}`}
								onClick={() => handleRangeChange(r.value)}
							>
								{r.label}
							</button>
						))}
					</div>
					<button className="analytics-export-btn" title="Export (UI only)">
						<Export size={18} weight="bold" />
						Export
					</button>
				</div>
			</div>

			{loading ? (
				<div className="analytics-page__skeleton">
					<div className="analytics-page__kpis">
						{Array.from({ length: 3 }).map((_, i) => (
							<SkeletonBlock key={i} height={100} />
						))}
					</div>
					<div className="analytics-page__charts">
						<SkeletonBlock height={340} />
						<SkeletonBlock height={340} />
						<SkeletonBlock height={340} />
					</div>
				</div>
			) : data && (
				<div className="analytics-page__content">
					<div className="analytics-page__kpis">
						<KPICard
							icon={CalendarBlank}
							label="Total Reservations"
							value={data.kpis.totalReservations.value}
							trend={data.kpis.totalReservations.trend}
						/>
						<KPICard
							icon={Clock}
							label="Peak Usage Time"
							value={data.kpis.peakUsageTime.value}
						/>
						<KPICard
							icon={UsersThree}
							label="Active Users"
							value={data.kpis.activeUsers.value}
							trend={data.kpis.activeUsers.trend}
						/>
					</div>

					<div className="analytics-page__charts">
						<ReservationTrendChart data={data.hourlyTrend} />
						<TimeSlotChart data={data.timeSlotDistribution} />
						<UserActivityChart data={data.userActivity} />
					</div>
				</div>
			)}
		</section>
	);
}
