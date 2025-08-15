export const ClockInModel = {
    table: "clock_ins",
    fields: {
        id: "int",
        user_id: "int",
        work_mode: "int",
        check_in: "varchar",
        check_out: "varchar",
        created_at: "timestamp"
    }
};