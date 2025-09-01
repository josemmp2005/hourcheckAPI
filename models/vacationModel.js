export const VacationModel = {
    table: 'vacations',
    fields: {
        id: 'int',
        user_id: 'int',
        leave_type_id: 'int',
        start_date: 'date',
        end_date: 'date',
        status: 'string',
        created_at: 'timestamp'
    }
}