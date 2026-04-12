export default function SkeletonBlock({ height = 200, borderRadius = 'var(--radius-xl)' }) {
	return (
		<div
			className="skeleton-block"
			style={{ height, borderRadius }}
			aria-hidden="true"
		/>
	);
}
