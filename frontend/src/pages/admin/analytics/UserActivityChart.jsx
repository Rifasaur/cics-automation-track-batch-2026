import {
	PieChart, Pie, Cell, Tooltip, Legend,
	ResponsiveContainer,
} from 'recharts';
import Card from '../../../shared/components/Card';
import { CHART_COLORS } from './analyticsData';

export default function UserActivityChart({ data }) {
	return (
		<Card className="analytics-chart" padding="md">
			<h3 className="analytics-chart__title">User Activity</h3>
			<p className="analytics-chart__subtitle">Segmentation by visit frequency</p>
			<div className="analytics-chart__container">
				<ResponsiveContainer width="100%" height={280}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={55}
							outerRadius={95}
							paddingAngle={3}
							dataKey="value"
							nameKey="name"
						>
							{data.map((_, index) => (
								<Cell
									key={`cell-${index}`}
									fill={CHART_COLORS.pie[index % CHART_COLORS.pie.length]}
								/>
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								background: 'var(--bg-elevated)',
								border: '1px solid var(--border-subtle)',
								borderRadius: 'var(--radius-md)',
								fontSize: '0.875rem',
							}}
						/>
						<Legend
							wrapperStyle={{ fontSize: '0.8rem' }}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
}
