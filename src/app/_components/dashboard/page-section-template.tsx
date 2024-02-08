"use client";

import Link from "next/link";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { AiOutlineDown, AiOutlinePlusCircle } from "react-icons/ai";
import { BsPencil, BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { sharedStyles } from "../../utils/shared-styles";
import { useOuterClick } from "../hooks";
import { LiaEyeSlash } from "react-icons/lia";
import { FaCog } from "react-icons/fa";

type PageSectionsTemplateProps = {
  title: string;
  children?: React.ReactNode;
  collapse: boolean;
  setShowRsvpSettings?: Dispatch<SetStateAction<boolean>>;
};

export default function PageSectionsTemplate({
  title,
  children,
  collapse,
  setShowRsvpSettings,
}: PageSectionsTemplateProps) {
  const [showSection, setShowSection] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setShowSection(!collapse ?? true);
  }, [collapse]);

  return (
    <section className="mb-10">
      <div className="w-full border">
        <div className="flex justify-between px-5 py-7">
          <div className="flex">
            <button onClick={() => setShowSection(true)}>
              {showSection ? <IoIosArrowForward /> : <AiOutlineDown />}
            </button>
            <h2 className="ml-3 text-xl font-semibold">{title}</h2>
          </div>
          <div className="flex">
            <Link href="/dashboard/preview">
              <button className="text-pink-400">Preview</button>
            </Link>
            {title !== "Home" && (
              <div className="relative flex">
                <span className={`${sharedStyles.verticalDivider}`}>|</span>
                <BsThreeDotsVertical
                  size={24}
                  onClick={() => setShowMenu(true)}
                  className="cursor-pointer"
                />
                {showMenu && (
                  <EditSectionMenu
                    setShowMenu={setShowMenu}
                    isRsvpSection={title === "RSVP"}
                    setShowRsvpSettings={setShowRsvpSettings}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        {showSection && (
          <>
            {children}
            <div className="border-t"></div>
            <div className="p-5">
              <div className="flex cursor-pointer">
                <AiOutlinePlusCircle
                  size={25}
                  color={sharedStyles.primaryColorHex}
                />
                <p className={`pl-3 text-${sharedStyles.primaryColor}`}>
                  Add More to {title}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

type EditSectionMenuProps = {
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  isRsvpSection: boolean;
  setShowRsvpSettings?: Dispatch<SetStateAction<boolean>>;
};

const EditSectionMenu = ({
  setShowMenu,
  isRsvpSection,
  setShowRsvpSettings,
}: EditSectionMenuProps) => {
  const editSectionMenuRef = useOuterClick(() => setShowMenu(false));
  return (
    <div
      ref={editSectionMenuRef}
      className="absolute -left-32 top-9 z-20 flex w-48 flex-col bg-white shadow-[1px_2px_14px_1px_rgba(30,30,30,0.22)]"
    >
      {isRsvpSection ? (
        <>
          <div
            className={`flex cursor-pointer items-center gap-3 border-b p-4 hover:underline text-${sharedStyles.primaryColor}`}
          >
            <BsPencil size={20} color={sharedStyles.primaryColorHex} />
            <p className="text-lg">Edit Form</p>
          </div>
          <div
            className={`flex cursor-pointer items-center gap-3 border-b p-4 hover:underline text-${sharedStyles.primaryColor}`}
          >
            <LiaEyeSlash size={20} color={sharedStyles.primaryColorHex} />
            <p className="text-lg">Hide Page</p>
          </div>
          <div
            className={`flex cursor-pointer items-center gap-3 p-4 hover:underline text-${sharedStyles.primaryColor}`}
            onClick={() => setShowRsvpSettings && setShowRsvpSettings(true)}
          >
            <FaCog size={20} color={sharedStyles.primaryColorHex} />
            <p className="text-lg">RSVP Settings</p>
          </div>
        </>
      ) : (
        <>
          <div
            className={`flex cursor-pointer items-center gap-3 border-b p-4 hover:underline text-${sharedStyles.primaryColor}`}
          >
            <LiaEyeSlash size={20} color={sharedStyles.primaryColorHex} />
            <p className="text-lg">Hide Page</p>
          </div>
          <div
            className={`flex cursor-pointer items-center gap-3 p-4 hover:underline text-${sharedStyles.primaryColor}`}
          >
            <BsPencil size={20} color={sharedStyles.primaryColorHex} />
            <p className="text-lg">Rename Page</p>
          </div>
        </>
      )}
    </div>
  );
};
