export const CompanyInvitationModel = {
    table: "company_invitations",
    columns: {
        id: "int",
        company_id: "int",
        role_id: "int",
        invited_by: "int",
        email: "string",
        token: "string",
        status: "string",
        created_at: "timestamp",
        expires_at: "timestamp"
    }
}