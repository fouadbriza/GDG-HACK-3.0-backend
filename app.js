import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger.js";
import caregiversRoute from "./routes/caregivers.js";
import usersRoute from "./routes/users.js";
import patientsRoute from "./routes/patients.js";
import authRoute from "./routes/auth.js";
import passwordRoute from "./routes/password.js";
import appointmentsRoute from "./routes/appointments.js";
import availabilityRoute from "./routes/availability.js";
import medicalNotesRoute from "./routes/medicalNotes.js";
import messagesRoute from "./routes/messages.js";
import serviceRequestsRoute from "./routes/serviceRequests.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

await connectToDB();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/caregivers", caregiversRoute);
app.use("/users", usersRoute);
app.use("/patients", patientsRoute);
app.use("/auth", authRoute);
app.use("/password", passwordRoute);
app.use("/appointments", appointmentsRoute);
app.use("/availability", availabilityRoute);
app.use("/medical-notes", medicalNotesRoute);
app.use("/messages", messagesRoute);
app.use("/service-requests", serviceRequestsRoute);

app.listen(PORT, () => {
  console.log(`App running in: http://localhost:${PORT}`);
  console.log(`Swagger docs available at: http://localhost:${PORT}/api-docs`);
});
