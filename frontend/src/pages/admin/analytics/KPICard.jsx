import Card from '../../../shared/components/Card';

export default function KPICard({ icon: Icon, label, value, trend }) {
	return (
		<Card className="kpi-card" padding="md" interactive>
			<div className="kpi-card__icon-wrap">
				{Icon && <Icon size={22} weight="duotone" />}
			</div>
			<div className="kpi-card__body">
				<span className="kpi-card__label">{label}</span>
				<strong className="kpi-card__value">{value}</strong>
				{trend && <span className="kpi-card__trend">{trend}</span>}
			</div>
		</Card>
	);
}
