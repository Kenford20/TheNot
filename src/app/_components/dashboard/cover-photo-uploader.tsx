"use client";

import { useCallback, useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { sharedStyles } from "~/app/utils/shared-styles";
import { useDropzone, type FileWithPath } from "react-dropzone";
import ImageCropperModal from "./cropper-modal";

import { type CoverPhoto } from "~/app/utils/shared-types";

export default function CoverPhotoUploader({
  uploadImage,
}: {
  uploadImage: (formData: FormData) => void;
}) {
  const [coverPhoto, setCoverPhoto] = useState<CoverPhoto[]>([]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles?.length) {
      setCoverPhoto(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) }),
        ),
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    maxFiles: 1,
    onDrop,
  });

  useEffect(() => {
    console.log("photoz", coverPhoto);
    // Revoke the data uris to avoid memory leaks
    return () =>
      coverPhoto.forEach((photo) => URL.revokeObjectURL(photo.preview));
  }, [coverPhoto]);

  const upload = () => {
    const file = coverPhoto[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("type", file.type);
    uploadImage(formData);
  };

  return (
    <form action={upload}>
      <ImageCropperModal
        coverPhoto={coverPhoto}
        setCoverPhoto={setCoverPhoto}
      />
      <input {...getInputProps({ name: "file" })} />
      <div {...getRootProps({ className: "dropzone px-10" })}>
        <div className="flex cursor-pointer items-center justify-center border py-16 transition-colors duration-300 ease-in-out hover:bg-gray-100">
          <div className="flex">
            <AiOutlinePlusCircle
              size={25}
              color={sharedStyles.primaryColorHex}
            />
            <p className={`pl-3 text-${sharedStyles.primaryColor}`}>
              Add a Cover Photo
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
