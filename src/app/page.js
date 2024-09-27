import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landing() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '0 20px', backgroundColor: '#f9fafb' }}>
      
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
        <Link href="/sign-up">
          <Button style={{ backgroundColor: '#0070f3', color: '#fff' }}>Sign Up</Button>
        </Link>
        <Link href="/sign-in">
          <Button style={{ backgroundColor: '#6366f1', color: '#fff' }}>Sign In</Button>
        </Link>
      </div>

      
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Welcome to Spread<strong className="text-sky-500">it</strong></h1>
        <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '40px' }}>
          Discover and share amazing stories, ideas, and experiences. Join our community and start spreading your words to the world!
        </p>
        <Link href="/home">
          <Button className="text-sky-500" style={{  color: '#fff', padding: '12px 24px', fontSize: '18px' }}>
            Explore Spreadit
          </Button>
        </Link>
      </div>
    </div>
  );
}
