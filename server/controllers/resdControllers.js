import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

//Create Residency
export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    image,
    facilities,
    userEmail,
  } = req.body.data;
  console.log(req.body.data);

  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        image,
        facilities,
        owner: { connect: { email: userEmail } },
      },
    });

    res.json({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("Residency with this address already exists");
    }
    throw new Error(err.message);
  }
});

//Get All Residencies

export const getAllResidencies = asyncHandler(async (req, res) => {
  try {
    const residencies = await prisma.residency.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(residencies);
  } catch (error) {
    res.status(404).json({ message: "Residency Not Found!" });
  }
});

//Get Residency
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const residency = await prisma.residency.findUnique({ where: { id } });
    res.send(residency);
  } catch (error) {
    throw new Error(error.message);
  }
});
