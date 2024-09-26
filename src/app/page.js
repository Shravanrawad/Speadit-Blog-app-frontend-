import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landing() {
  return (
    <div>

      <Link href={'/sign-up'}>
      <Button>
         Sign-up
      </Button>
      </Link>

      <Link href={'/sign-in'}>
      <Button>
         Sign-in
      </Button>
      </Link>

    </div>
  );
}
