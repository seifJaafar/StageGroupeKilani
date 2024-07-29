const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const EmployeSchema = new Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
}, { _id: false });
const UserSchema = new Schema({
    password: {
        type: String,
        minlength: 4,
        maxlength: 128,
        required: true
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        index: { unique: true }
    },
    phone: {
        type: String,
        index: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[0-9]+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Only numeric characters are allowed.`
        }
    },
    role: {
        type: String,
        required: true,
        enum: ['laboratoire', 'admin', 'employee']
    }
    ,
    approved: {
        type: Boolean,
        default: false
    },
    laboratoire: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Laboratoire', required: function () {
            return (this.role === 'laboratoire');
        }
    },
    username: {
        type: String
    },
    employee: {
        type: EmployeSchema,
        required: function () {
            return this.role === 'employee';
        }
    }
}

)
UserSchema.pre('save', async function save(next) {
    try {
        const rounds = 10;
        if (this.isModified('password')) {
            const hash = await bcrypt.hash(this.password, rounds);
            this.password = hash;
        }
        return next();
    } catch (error) {
        return next(error);
    }
});
UserSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}
UserSchema.methods.token = async function () {
    const payload = {
        exp: moment().add(process.env.JWT_EXPIRATION, 'minutes').unix(),
        iat: moment().unix(),
        sub: this._id
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
}
const User = mongoose.model("User", UserSchema);
module.exports = User;
