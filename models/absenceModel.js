export const absenceModel = {
    table: "absences",
    fields: {
        id: "int",
        user_id: "int",
        leave_type: "int",
        start_date: "date",
        end_date: "date",
        reason: "text",
        created_at: "timestamp"
    }
}