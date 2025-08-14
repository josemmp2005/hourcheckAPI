export const CompanyModel = {
    table: "companies",
    fields: {
        id: "serial",
        name: "string",
        address: "text",
        phone: "string",
        email: "string",
        created_at: "timestamp"
    }
};