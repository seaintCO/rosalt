import Link from "next/link";
export function Brand({locale="en"}:{locale?:string}){return <Link className="brand rosalt-brand" href={`/${locale}`} aria-label="ROSALT Maison Studios home"><img src="/images/rosalt-ra-logo-full.png" alt="ROSALT RA monogram"/><span>ROSALT</span><small>MAISON STUDIOS · MAISON AI</small></Link>}
