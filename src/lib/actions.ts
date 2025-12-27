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

export async function createRequest(formData: FormData) {
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;
  const equipmentId = formData.get("equipmentId") as string;
  const type = formData.get("type") as string;
  const priority = formData.get("priority") as string;
  
  // 1. Find the equipment to get its Team ID
  const equipment = await db.equipment.findUnique({
    where: { id: equipmentId },
    include: { team: true } // We need the team connection
  });

  if (!equipment) throw new Error("Equipment not found");

  // 2. Create the request and AUTOMATICALLY link the correct team
  await db.request.create({
    data: {
      subject,
      type,         // 'Corrective' or 'Preventive'
      priority,     // 'High', 'Medium', 'Low'
      status: "New",
      equipmentId: equipment.id,
      teamId: equipment.teamId, // <--- MAGIC: Auto-assigns the team
    },
  });

  revalidatePath("/requests");
  revalidatePath("/kanban"); // We'll build this later
}

export async function updateRequestStatus(requestId: string, newStatus: string) {
  await db.request.update({
    where: { id: requestId },
    data: { status: newStatus }
  });
  
  revalidatePath("/kanban");
  revalidatePath("/requests");
}

export async function scheduleMaintenance(formData: FormData) {
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;
  const equipmentId = formData.get("equipmentId") as string;
  const type = formData.get("type") as string; // 'Preventive' or 'Corrective'
  const priority = formData.get("priority") as string;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const estimatedHours = parseFloat(formData.get("estimatedHours") as string);

  // Combine Date and Time into one ISO DateTime string
  const scheduledDate = new Date(`${dateStr}T${timeStr}:00`);

  // Find equipment to link team
  const equipment = await db.equipment.findUnique({
    where: { id: equipmentId },
    include: { team: true }
  });

  if (!equipment) throw new Error("Equipment not found");

  await db.request.create({
    data: {
      subject,
      description, // Ensure you added 'description' to schema in previous step if not present
      type,
      priority,
      status: "New",
      scheduledDate,
      estimatedHours,
      equipmentId: equipment.id,
      teamId: equipment.teamId,
    },
  });

  revalidatePath("/calendar");
  revalidatePath("/requests");
}