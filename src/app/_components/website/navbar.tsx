import Link from "next/link";

export default function Navbar({ path }: { path: string }) {
  return (
    <div className="mb-5 mt-10 px-20">
      <ul className="flex justify-between">
        <div className="flex gap-7">
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={path}>
              Home
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${path}/our-story`}>
              Our Story
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${path}/wedding-party`}>
              Wedding Party
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${path}/photos`}>
              Photos
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${path}/q-a`}>
              Q + A
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${path}/travel`}>
              Travel
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${path}/things-to-do`}>
              Things to Do
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${path}/registry`}>
              Registry
            </Link>
          </li>
          <li className="border-b-2 border-transparent pb-1 hover:border-gray-600">
            <Link className="" href={`${path}/rsvp`}>
              RSVP
            </Link>
          </li>
        </div>
      </ul>
    </div>
  );
}
