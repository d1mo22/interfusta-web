import { notFound } from "next/navigation";

// Unknown URLs (including the proxy's /ca/<junk> rewrites) get the site 404
// inside the site chrome, instead of Next's bare default page.
export default function Missing() {
	notFound();
}
