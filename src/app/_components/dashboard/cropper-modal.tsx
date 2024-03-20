import { type Dispatch, type SetStateAction, useRef } from "react";
import { sharedStyles } from "~/app/utils/shared-styles";
import { useDisablePageScroll } from "../hooks";
import { GrRotateRight } from "react-icons/gr";
import { GrRotateLeft } from "react-icons/gr";
import Cropper, { type ReactCropperElement } from "react-cropper";
import { debounce } from "~/app/utils/helpers";
import "cropperjs/dist/cropper.css";

import { type CoverPhoto } from "~/app/utils/shared-types";

export default function ImageCropperModal({
  coverPhoto,
  setCoverPhoto,
}: {
  coverPhoto: CoverPhoto[];
  setCoverPhoto: Dispatch<SetStateAction<CoverPhoto[]>>;
}) {
  useDisablePageScroll();
  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    console.log(cropper?.getCroppedCanvas().toDataURL());
  };

  return (
    <div className="bg fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-transparent/[0.5]">
      <div className="h-[700px] w-[800px] rounded-md bg-white px-9 py-12">
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-2xl font-semibold">Adjust Photo</h1>
          <div className="flex gap-3">
            <GrRotateLeft
              size={24}
              className="cursor-pointer"
              onClick={() => cropperRef.current?.cropper.rotate(-90)}
            />
            <GrRotateRight
              size={24}
              className="cursor-pointer"
              onClick={() => cropperRef.current?.cropper.rotate(90)}
            />
          </div>
        </div>

        <div className="my-5 flex h-[500px] w-full items-center bg-black">
          {coverPhoto.map((photo) => (
            <Cropper
              key={photo.name}
              src={photo.preview}
              className="h-[400px] w-full"
              crop={debounce(onCrop, 200)}
              ref={cropperRef}
              background={false}
              viewMode={1}
              aspectRatio={18 / 9}
              autoCropArea={1}
            />
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className={sharedStyles.secondaryButton({ py: "py-2" })}
            onClick={() => setCoverPhoto([])}
          >
            Cancel Changes
          </button>
          <button
            type="submit"
            className={sharedStyles.primaryButton({ py: "py-2" })}
          >
            Crop Photo
          </button>
        </div>
      </div>
    </div>
  );
}
