"use server";

import db from "./db";
import { revalidatePath } from "next/cache";

export async function createEquipment(formData: FormData) {
  const name = formData.get("name") as string;
  const serialNumber = formData.get("serialNumber") as string;
  const department = formData.get("department") as string;
  const location = formData.get("location") as string;
  const teamId = formData.get("teamId") as string;

  await db.equipment.create({
    data: {
      name,
      serialNumber,
      department,
      location,
      teamId,
      status: "Active",
    },
  });

  // This refreshes the page so the new equipment appears immediately
  revalidatePath("/equipment");
}