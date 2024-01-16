enum Validations {
    email_invalid = "Please provide a valid email address.",
    email_required = "Please provide an email to continue.",
    email_empty = "Email provided is empty. Please provide a valid email address",
    email_max = "Email address is too long. Please do not provide more than 500 characters.",

    password = "Please proide a password for regietering new account.",
    password_min = "Please provide atleast 5 characters for your password.",
    password_max = "Password is too long. Please do not provide more than 50 characters for password.",

    name_required = "Please provide your name to register a new account.",
    name_min = "Please provide atleast one character for your name",
    name_max = "Name is too long. Please do not provide more than 100 characters.",
}

export = class Messages {
    static emailValidationMesages(): any {
        return {
            "any.required": Validations.email_required,
            "string.empty": Validations.email_empty,
            "string.min": Validations.email_empty,
            "string.max": Validations.email_max,
            "string.email": Validations.email_invalid,
        };
    }
    static passwordValidationMessages(): any {
        return {
            "any.required": Validations.password,
            "string.empty": Validations.password_min,
            "string.min": Validations.password_min,
            "string.max": Validations.password_max,
        };
    }

    static nameValidationMessages(): any {
        return {
            "any.required": Validations.name_required,
            "string.empty": Validations.name_min,
            "string.min": Validations.name_min,
            "string.max": Validations.name_max,
        };
    }
};
