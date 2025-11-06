const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowerCase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        },
        active: {
            type: Boolean,
            default: true
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    }
)

//Antes de salvar, criptografa a senha
userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();
    //apenas se mudou a senha
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const userModel = mongoose.model("user", userSchema)
module.exports = userModel