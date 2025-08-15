export const UserModel = {
    table: 'users',
    fields: {
        id: 'number',
        name: 'string',
        email: 'string',
        password_hash: 'string',
        active: 'boolean',
        photo_url: 'string',
        created_at: 'string',
        updated_at: 'string'
    }
};