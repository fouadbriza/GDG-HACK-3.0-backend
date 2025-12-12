import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Elderly Care Platform API",
      version: "1.0.0",
      description:
        "API for managing appointments, medical notes, caregivers, and service requests for elderly care",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            status: { type: "string", enum: ["active", "inactive"] },
            role: { type: "string", enum: ["user", "admin", "caregiver"] },
            emergencyContact: {
              type: "object",
              properties: {
                name: { type: "string" },
                phone: { type: "string" },
              },
            },
            assignedCaregivers: { type: "array", items: { type: "string" } },
            messages: { type: "array" },
            serviceRequests: { type: "array" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Caregiver: {
          type: "object",
          properties: {
            _id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            specialization: { type: "string" },
            phone: { type: "string" },
            isAdmin: { type: "boolean" },
            availability: { type: "array" },
            messages: { type: "array" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Appointment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            caregiverId: { type: "string" },
            patientId: { type: "string" },
            date: { type: "string", format: "date-time" },
            notes: { type: "string" },
            status: {
              type: "string",
              enum: ["scheduled", "completed", "cancelled"],
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ServiceRequest: {
          type: "object",
          properties: {
            _id: { type: "string" },
            patientId: { type: "string" },
            caregiverId: { type: "string" },
            category: {
              type: "string",
              enum: ["health", "transport", "home care", "groceries"],
            },
            description: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "accepted", "completed", "cancelled"],
            },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        MedicalNote: {
          type: "object",
          properties: {
            _id: { type: "string" },
            caregiverId: { type: "string" },
            patientId: { type: "string" },
            notes: { type: "string" },
            medications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  dosage: { type: "string" },
                  frequency: { type: "string" },
                },
              },
            },
            issuedAt: { type: "string", format: "date-time" },
          },
        },
        Message: {
          type: "object",
          properties: {
            _id: { type: "string" },
            senderId: { type: "string" },
            content: { type: "string" },
            type: {
              type: "string",
              enum: ["appointment", "service", "notification"],
            },
            read: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./routes/auth.js",
    "./routes/caregivers.js",
    "./routes/users.js",
    "./routes/patients.js",
    "./routes/appointments.js",
    "./routes/availability.js",
    "./routes/medicalNotes.js",
    "./routes/messages.js",
    "./routes/serviceRequests.js",
  ],
};

export const specs = swaggerJsdoc(options);
