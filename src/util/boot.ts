import Role, { RoleDoc } from '../schema/Role';
import User from '../schema/User';
import Crypto from './Crypto';
import Logger from './logger';

const createAdminUser = async () => {
    let role = await Role.findOne({
        name: "admin"
    });
    let adminpass = Crypto.generateUUID();

    let admin = new User({
        username: "admin",
        password: adminpass,
        email: "admin@hameenlinna.fi",
        role: role!._id,
    });

    let admincount = await User.countDocuments({ username: "admin" });
    //In case the admin user already exists, we don't want to create a new one.
    if (!admincount) {
        await admin.save();
        Logger.warn(`Admin user registered, password: ${adminpass}`);
    } else {
        Logger.info("Admin user exists, not creating a new one.");
    }
}

const createDefaultRoles = async () => {
    let roles =
        [{
            name: "admin",
            isAdmin: true,
            canCreateJobPosting: true,
        }, {
            name: "workplace",
            isAdmin: false,
            canCreateJobPosting: true,
        },
        ]
    roles.forEach(async r => {
        Role.findOneAndUpdate({
            name: r.name
        }, {
            $set: r
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }).then(val => {
            Logger.info(`Created role ${val.name}`)
        })
    })
}

export default {
    createAdminUser,
    createDefaultRoles
}