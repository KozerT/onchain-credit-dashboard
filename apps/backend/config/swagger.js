import dotenv from "dotenv";
dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fintech Sandbox API",
      version: "1.0.0",
      description:
        "API documentation for the Credit Institution and Loan management system.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
      },
    ],
    paths: {
      "/api/institutions": {
        get: {
          tags: ["Institutions"],
          summary: "Returns the list of all the institutions",
          responses: {
            200: {
              description: "The list of the institutions",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Institution" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Institutions"],
          summary: "Create a new credit institution",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Institution" },
              },
            },
          },
          responses: {
            201: {
              description: "The institution was successfully created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Institution" },
                },
              },
            },
            500: { description: "Server error" },
          },
        },
      },
      "/api/institutions/{institutionId}/upload": {
        post: {
          tags: ["Institutions"],
          summary: "Upload a CSV of loans for a specific institution",
          parameters: [
            {
              in: "path",
              name: "institutionId",
              schema: { type: "string" },
              required: true,
              description: "The institution ID",
            },
          ],
          requestBody: {
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    file: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "CSV processed successfully" },
            404: { description: "Institution not found" },
          },
        },
      },
      "/api/institutions/{institutionId}/loans": {
        get: {
          tags: ["Institutions"],
          summary: "Get all loans for a specific institution",
          parameters: [
            {
              in: "path",
              name: "institutionId",
              schema: { type: "string" },
              required: true,
              description: "The institution ID",
            },
          ],
          responses: {
            200: {
              description: "A list of loans",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Loan" },
                  },
                },
              },
            },
          },
        },
      },
      "/api/institutions/dashboard/{institutionId}": {
        get: {
          tags: ["Institutions"],
          summary: "Get a dashboard summary for an institution",
          parameters: [
            {
              in: "path",
              name: "institutionId",
              schema: { type: "string" },
              required: true,
              description: "The institution ID",
            },
          ],
          responses: {
            200: { description: "Dashboard summary data" },
            404: { description: "Institution not found" },
          },
        },
      },
      "/api/loans/{loanId}/invest": {
        patch: {
          tags: ["Loans"],
          summary: "Invest in a specific loan",
          parameters: [
            {
              in: "path",
              name: "loanId",
              schema: { type: "string" },
              required: true,
              description: "The loan ID",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    amountToInvest: { type: "number" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Successful investment",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Loan" },
                },
              },
            },
          },
        },
      },
      "/api/loans/update-statuses": {
        post: {
          tags: ["Loans"],
          summary: "Update status of all expired loans",
          responses: {
            200: { description: "Loan statuses updated" },
          },
        },
      },
    },
    components: {
      schemas: {
        Institution: {
          type: "object",
          required: ["name", "country", "foundingYear", "productType"],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the institution",
            },
            name: {
              type: "string",
              description: "Name of the credit institution",
            },
            country: {
              type: "string",
              description: "Country where the institution is based",
            },
            foundingYear: {
              type: "number",
              description: "The year the institution was founded",
            },
            totalPortfolio: {
              type: "number",
              description: "Total portfolio value in EUR",
            },
            creditRiskScore: {
              type: "number",
              description: "Risk score from 0 to 100",
            },
            productType: {
              type: "string",
              enum: ["Mortgage", "Private", "Business"],
              description: "Main product type",
            },
            websiteUrl: { type: "string", description: "Official website URL" },
            contacts: { type: "string", description: "Contact information" },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date the record was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date the record was last updated",
            },
          },
        },
        Loan: {
          type: "object",
          required: [
            "institution",
            "loanId",
            "principalOpenEur",
            "classId",
            "nonceId",
          ],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the loan",
            },
            institution: {
              type: "string",
              description: "The ID of the parent institution",
            },
            loanId: {
              type: "string",
              description: "The business-specific ID from the CSV file",
            },
            classId: {
              type: "number",
              description: "The on-chain classId for the loan",
            },
            nonceId: {
              type: "number",
              description: "The on-chain nonceId for the loan",
            },
            loanType: { type: "string", description: "Type of the loan" },
            status: {
              type: "string",
              enum: ["ACTIVE", "EXPIRED", "PAID"],
              description: "Current status of the loan",
            },
            principalOpenEur: {
              type: "number",
              description: "The principal amount of the loan in EUR",
            },
            investedAmount: {
              type: "number",
              description: "The amount invested in the loan so far",
            },
            loanLastDate: {
              type: "string",
              format: "date-time",
              description: "The expiration date of the loan",
            },
            url: {
              type: "string",
              description:
                "URL reference from the CSV, typically for on-chain data",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date the record was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date the record was last updated",
            },
          },
        },
      },
    },
  },
  apis: [],
};

export default swaggerOptions;
