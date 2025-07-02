const userDataLayer  = require("../data/userData");
const bcrypt = require('bcrypt');

async function registerUser({ name, email, password, salutation,
    marketingPreferences, country }) {
    if (password.length < 8) {
        // throw to an error to the route function if there's an error
        throw Error("Password must be at least 8 characters long");
    }

    const existingUser = await userDataLayer.getUserByEmail(email);
    if (existingUser) {
        throw Error("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = await userDataLayer.createUser({
        name, 
        email, 
        "password":hashedPassword, 
        salutation, 
        country, 
        marketingPreferences
    });
    return newUserId;

}

async function loginUser(email, password) {
    // does a user with the email exists
    const existingUser = await userDataLayer.getUserByEmail(email);

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!existingUser || !isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    return existingUser;
}

async function updateUserDetails(id, userDetails) {
    
    // todo: validate all the fields
    return await userDataLayer.updateUser(id, userDetails);
}

async function getUserDetailsById(id) {
    const user = await userDataLayer.getUserById(id);
    delete user.password;
    return user;
}

async function deleteUserById(id){
    return await userDataLayer.deleteUser(id);
}


module.exports = {
    registerUser,
    loginUser,
    updateUserDetails,
    getUserDetailsById,
    deleteUserById
}