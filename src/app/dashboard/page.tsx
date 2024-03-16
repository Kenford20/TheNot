import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { sharedStyles } from "../utils/shared-styles";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import Dashboard from "../_components/dashboard";

const Bucket = process.env.AWS_s3_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const uploadImage = async (formData: FormData) => {
  "use server";
  const files = formData.getAll("file") as File[];
  const fileType = formData.get("type") as string;

  const response = await Promise.all(
    files.map(async (file) => {
      const Body = (await file.arrayBuffer()) as Buffer;
      await s3.send(
        new PutObjectCommand({
          Bucket,
          Key: file.name,
          Body,
          ContentType: fileType,
        }),
      );
    }),
  ).then((data) => console.log("dataz", data));
  console.log("sa response", response);
};

export default async function DashboardPage() {
  const dashboardData = await api.dashboard.getByUserId.query();

  if (dashboardData === null) {
    redirect("/");
  }

  return (
    <main
      className={`${sharedStyles.desktopPaddingSides} ${sharedStyles.minPageWidth}`}
    >
      <Dashboard dashboardData={dashboardData} uploadImage={uploadImage} />
    </main>
  );
}
