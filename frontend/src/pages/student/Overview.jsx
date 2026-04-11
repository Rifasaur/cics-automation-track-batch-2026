import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../data/services/authService';
import { getAvailabilityByDate } from '../../features/availability/services/availabilityService';
import AvailabilityPanel from '../../features/availability/components/AvailabilityPanel';
import CapacityMap from '../../features/availability/components/CapacityMap';
import Card from '../../shared/components/Card';
import PageHeader from '../../shared/components/PageHeader';

export default function Overview() {
    const [user, setUser] = useState(null);
    const [availability, setAvailability] = useState(null);

    useEffect(() => {
        let active = true;

        async function loadOverview() {
            const [currentUser, todayAvailability] = await Promise.all([
                getCurrentUser(),
                getAvailabilityByDate(new Date()),
            ]);

            if (!active) return;

            setUser(currentUser);
            setAvailability(todayAvailability);
        }

        loadOverview();

        return () => {
            active = false;
        };
    }, []);

    if (!availability) {
        return <section style={{ padding: '2rem' }}>Loading overview...</section>;
    }

    return (
        <section style={{ padding: '2rem' }}>
            <PageHeader
                title="Student Overview"
                subtitle={user ? `Welcome, ${user.name}.` : 'Quick view of today\'s learning commons availability and reservation status.'}
            />

            <AvailabilityPanel
                availability={availability}
            />

            <div style={{ marginTop: '2rem' }}>
                <CapacityMap />
            </div>
        </section>
    );
}