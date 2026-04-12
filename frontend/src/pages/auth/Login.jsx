import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, login } from '../../data/services/authService';
import cicsLogo from '../../assets/CICS-Logo.png';
import './AuthPages.css';

export default function Login() {
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useState(null);
	const [isPageLoading, setIsPageLoading] = useState(true);
	const [email, setEmail] = useState('juan.delacruz.cics@ust.edu.ph');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [statusMessage, setStatusMessage] = useState('Sign in using your university credentials to reserve slots.');

	useEffect(() => {
		let active = true;

		async function loadLoginPage() {
			try {
				const [user] = await Promise.all([
					getCurrentUser(),
					new Promise((resolve) => setTimeout(resolve, 700)),
				]);

				if (!active) return;

				setCurrentUser(user);
			} finally {
				if (active) {
					setIsPageLoading(false);
				}
			}
		}

		loadLoginPage();

		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		const previousTitle = document.title;
		document.title = 'Login - UST CICS Learning Commons';

		return () => {
			document.title = previousTitle;
		};
	}, []);

	function getRoleRoute(role) {
		if (role === 'admin') return '/admin';
		if (role === 'staff') return '/staff';
		return '/';
	}

	async function handleQuickLogin(targetEmail = 'juan@ust.edu.ph') {
		setIsSubmitting(true);
		setStatusMessage('Signing you in...');

		const user = await login(targetEmail);
		setCurrentUser(user);

		if (user) {
			setStatusMessage(`Welcome back, ${user.name}. Redirecting...`);
			navigate(getRoleRoute(user.role));
		} else {
			setStatusMessage('Unable to sign in. Please try again.');
		}

		setIsSubmitting(false);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		await handleQuickLogin(email);
	}

	return (
		<section
			className={`auth-page auth-page--login ${
				isPageLoading ? 'auth-page--content-hidden' : 'auth-page--content-visible'
			}`}
		>
			<aside className="auth-showcase">
				<div className="auth-showcase__chip">Learning Commons Portal</div>
				<h1 className="auth-showcase__title">Study smarter with reservation-first access.</h1>
				<p className="auth-showcase__subtitle">
					Secure your preferred slot, track attendance, and manage daily schedule in one place.
				</p>
				<div className="auth-showcase__metric-card">
					<span className="auth-showcase__metric-label">Daily Throughput</span>
					<span className="auth-showcase__metric-value">1,284</span>
					<span className="auth-showcase__metric-change">+12% vs yesterday</span>
				</div>
			</aside>

			<div className="auth-panel">
				<div className="auth-panel__header">
					<h2>Welcome Back</h2>
					<p>Use your UST email account to continue.</p>
				</div>

				<form className="auth-form" onSubmit={handleSubmit}>
					<label className="auth-field">
						<span>UST Email Address</span>
						<input
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="Enter your UST email address"
							required
						/>
					</label>

					<label className="auth-field">
						<span>Password</span>
						<input
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="Enter your password"
							required
						/>
					</label>

					<div className="auth-form__row">
						<label className="auth-checkbox">
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={(event) => setRememberMe(event.target.checked)}
							/>
							<span>Remember Me</span>
						</label>
						<button type="button" className="auth-link-btn">Forgot Password?</button>
					</div>

					<button type="submit" className="auth-primary-btn" disabled={isSubmitting}>
						{isSubmitting ? 'Signing In...' : 'Sign In'}
					</button>
				</form>

				<div className="auth-panel__quick-actions">
					<span className="auth-panel__quick-label">Quick mock sessions</span>
					<div className="auth-panel__quick-buttons">
						<button type="button" onClick={() => handleQuickLogin('juan@ust.edu.ph')}>Student</button>
						<button type="button" onClick={() => handleQuickLogin('admin@ust.edu.ph')}>Admin</button>
						<button type="button" onClick={() => handleQuickLogin('staff@ust.edu.ph')}>Staff</button>
					</div>
				</div>

				<p className="auth-status-message">{statusMessage}</p>
				<p className="auth-session-message">
					{currentUser ? `Active session: ${currentUser.name}` : 'No active session yet.'}
				</p>

				<p className="auth-panel__footer">
					New here? <Link to="/auth/register">Create an account</Link>
				</p>
			</div>
			{isPageLoading ? (
				<div
					className="auth-register-transition"
					role="status"
					aria-live="polite"
					aria-label="Loading login page"
				>
					<div className="auth-register-transition__card">
						<img
							src={cicsLogo}
							alt="UST CICS logo"
							className="auth-register-transition__logo"
						/>
						<div className="auth-register-transition__loader" aria-hidden="true">
							<span></span>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
