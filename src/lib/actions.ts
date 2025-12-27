"use server";

import db from "./db";
import { revalidatePath } from "next/cache";

// --- 1. EQUIPMENT ACTIONS ---

export async function createEquipment(formData: FormData) {
  const name = formData.get("name") as string;
  const serialNumber = formData.get("serialNumber") as string;
  const department = formData.get("department") as string;
  const location = formData.get("location") as string;
  const teamId = formData.get("teamId") as string;
  
  // New fields required by the problem statement
  const assignedTo = formData.get("assignedTo") as string;
  const purchaseDateStr = formData.get("purchaseDate") as string;
  const warrantyEndStr = formData.get("warrantyEnd") as string;

  await db.equipment.create({
    data: {
      name,
      serialNumber,
      department,
      location,
      teamId,
      status: "Active",
      assignedTo: assignedTo || null,
      purchaseDate: purchaseDateStr ? new Date(purchaseDateStr) : null,
      warrantyEnd: warrantyEndStr ? new Date(warrantyEndStr) : null,
    },
  });

  revalidatePath("/equipment");
  revalidatePath("/"); // Update dashboard counts
}


// --- 2. REQUEST ACTIONS ---

export async function createRequest(formData: FormData) {
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string; // Ensure this is saved
  const equipmentId = formData.get("equipmentId") as string;
  const type = formData.get("type") as string;
  const priority = formData.get("priority") as string;
  
  // 1. Find the equipment to get its Team ID
  const equipment = await db.equipment.findUnique({
    where: { id: equipmentId },
    include: { team: true } 
  });

  if (!equipment) throw new Error("Equipment not found");

  // 2. Create the request and AUTOMATICALLY link the correct team
  await db.request.create({
    data: {
      subject,
      description, // Added description field here
      type,        // 'Corrective' or 'Preventive'
      priority,    // 'High', 'Medium', 'Low'
      status: "New",
      equipmentId: equipment.id,
      teamId: equipment.teamId, // Magic: Auto-assigns the team
    },
  });

  revalidatePath("/requests");
  revalidatePath("/kanban");
  revalidatePath("/"); // Update dashboard stats
}


// --- 3. WORKFLOW ACTIONS (KANBAN) ---

export async function updateRequestStatus(requestId: string, newStatus: string) {
  // 1. Update the request status
  const request = await db.request.update({
    where: { id: requestId },
    data: { status: newStatus },
    include: { equipment: true } // We need to know which equipment this is for
  });
  
  // 2. AUTOMATION: Scrap Logic (Required by Problem Statement)
  // "If a request is moved to the Scrap stage, indicate equipment is no longer usable"
  if (newStatus === "Scrap") {
    await db.equipment.update({
      where: { id: request.equipmentId },
      data: { status: "Scrapped" }
    });
  }

  // Optional: If moved to Repaired, make sure it goes back to Active
  if (newStatus === "Repaired") {
    await db.equipment.update({
      where: { id: request.equipmentId },
      data: { status: "Active" }
    });
  }

  revalidatePath("/kanban");
  revalidatePath("/requests");
  revalidatePath("/equipment"); // Important: Update equipment list to show "Scrapped" status
  revalidatePath("/"); 
}


// --- 4. CALENDAR ACTIONS ---

export async function scheduleMaintenance(formData: FormData) {
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;
  const equipmentId = formData.get("equipmentId") as string;
  const type = formData.get("type") as string; 
  const priority = formData.get("priority") as string;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const estimatedHours = parseFloat(formData.get("estimatedHours") as string);

  // Combine Date and Time
  const scheduledDate = new Date(`${dateStr}T${timeStr}:00`);

  const equipment = await db.equipment.findUnique({
    where: { id: equipmentId },
    include: { team: true }
  });

  if (!equipment) throw new Error("Equipment not found");

  await db.request.create({
    data: {
      subject,
      description,
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
  revalidatePath("/");
}