import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

//Register a User

export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");

  let { email } = req.body;
  const userExists = await prisma.User.findUnique({ where: { email: email } });
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "User Registered Successfully",
      user: user,
    });
  } else {
    res.status(201).json({ message: "User already registered" });
  }
});

//Book a Visit

export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;
  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "The Residency is already booked by you." });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.send("Your visit is booked successfully.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

//Get All Bookings by a user

export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).send(bookings);
    if (!bookings) {
      res.send("There are no bookings by you.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

//function to cancel the booking

export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });
      res.json({ message: "Booking Cancelled." });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

//Add a residency in favourites

export const toFav = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { rid } = req.params;
  let updateUser;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });
      res.send({ message: "Removed from Favorites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated favourites", user: updateUser });
    }
  } catch(error) {
    throw new Error(error.message);
  }
});

//To get all favourites

export const getAllFavourites =asyncHandler(async(req, res)=>{
  const {email}=req.body;
  try {
    const favResd = await prisma.user.findUnique({
      where:{email},
      select:{favResidenciesID: true},
    });
    res.status(200).send(favResd)
  } catch (error) {
    throw new Error(error.message);

  }
})
