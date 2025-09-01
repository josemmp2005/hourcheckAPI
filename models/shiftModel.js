export const ShiftModel = {
    table: "shifts",
    fields: {
        id: "int",
        company_id: "int",
        start_time: "time",
        end_time: "time",
        break_minutes: "int",
        created_at: "timestamp"
    }
}