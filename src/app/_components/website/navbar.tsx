import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="px-20">
      <ul className="flex justify-between">
        <div className="flex gap-7">
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={router.asPath}>
              Home
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${router.asPath}/our-story`}>
              Our Story
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${router.asPath}/wedding-party`}>
              Wedding Party
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${router.asPath}/photos`}>
              Photos
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${router.asPath}/q-a`}>
              Q + A
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${router.asPath}/travel`}>
              Travel
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${router.asPath}/things-to-do`}>
              Things to Do
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${router.asPath}/registry`}>
              Registry
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${router.asPath}/rsvp`}>
              RSVP
            </Link>
          </li>
        </div>
      </ul>
    </div>
  );
}
