import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Clinic Operations</h1>
      <p>
        <Link href="/patients/42/appointments">Open patient 42 appointments</Link>
      </p>
    </main>
  );
}
