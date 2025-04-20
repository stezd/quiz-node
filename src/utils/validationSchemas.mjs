export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: "Username harus 5-32 karakter.",
        },
        notEmpty: {
            errorMessage: "displayName tidak boleh kosong!",
        },
        isString: {
            errorMessage: "Username harus bertipe string!",
        },
    },
    displayName: {
        notEmpty: {
            errorMessage: "displayName tidak boleh kosong!",
        },
    },
};

export const queryUserValidationSchema = {
    filter: {
        isLength: {
            options: {
                min: 5,
                max: 10,
            },
            errorMessage: "Filter harus 5-10 karakter.",
        },
        notEmpty: {
            errorMessage: "Filter tidak boleh kosong!",
        },
        isString: {
            errorMessage: "Filter harus bertipe string!",
        },
    },
    value: {
        notEmpty: {
            errorMessage: "value tidak boleh kosong!",
        },
        isLength: {
            options: {
                min: 3,
                max: 10,
            },
            errorMessage: "value harus 3-10 karakter.",
        },
        isString: {
            errorMessage: "Filter harus bertipe string!",
        },
    },
};
