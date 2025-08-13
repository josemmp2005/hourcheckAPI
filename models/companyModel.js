export const CompanyModel = {
    table: "companies",
    fields: {
        id: "serial",
        name: "string",
        direction: "text",
        phone: "string",
        email: "string",
        created_at: "timestamp"
    }
};