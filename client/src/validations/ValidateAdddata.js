import { toast } from "react-hot-toast";
const schema = require("./AddDataValidation")
const ValidateAddData = (data) => {
    const { error, value } = schema.validate(data);
    if (error) {
        const errors = {};
        error.details.forEach((detail) => {
            errors[detail.path[0]] = detail.message;
        });
        toast.error(error.message);
        return { errors, valid: false };
    }
    return { valid: true };
};
export default ValidateAddData;