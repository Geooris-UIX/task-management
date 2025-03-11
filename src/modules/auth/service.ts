// All the bussiness logic(controller)

import argon2 from 'argon2';
import { AUTH_ERRORS } from "./constants";
import { createUser, findAllUsers, findUser, findUserByEmail, updateUser } from './repository';
import jwt from "jsonwebtoken";
import { IUser } from './types';
import { verificationMail } from '../../mailers/auth/authMailer';
import { deleteOTP, getOTP, storeOTP } from '../common/service';
import otpGenerator from "otp-generator";
import { findTask } from '../tasks/repository';

const generateOTP = (): string => {
  return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const {BAD_REQUEST, USER_EXISTS, USER_NOT_FOUND, PASSWORD_MISMATCH, INVALID_CREDENTIALS, 
    FAILED_USER_UPDATE, VERIFICATION_FAILED, OTP_ALREADY_PRESENT, ALREADY_VERIFIED} = AUTH_ERRORS;

const registration = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    if (!name || !email || !password) {
        throw BAD_REQUEST;
    }
    let user = await findUserByEmail(email);
    if(user) {
        throw USER_EXISTS;
    }
    if(password !== passwordConfirmation) {
        throw PASSWORD_MISMATCH;
    }
    password = await argon2.hash(password);
    
    let otp = generateOTP();
    await storeOTP(email, otp); // to store OTP in redis

    user =  await createUser({name, email, password} );
    await verificationMail(user.email, otp);
    return {
        name: user.name,
        email: user.email
    }
}

const resendOTP = async (email: string) => {   
    if (await getOTP(email)) {
        throw OTP_ALREADY_PRESENT;
    }

    const user = await findUser({email: email});
    if (user?.verified) {
        throw ALREADY_VERIFIED;
    }

    let otp = generateOTP();
    await storeOTP(email, otp); // to store OTP in redis

    await verificationMail(email, otp);

    return true;
}

const verifyOTP = async (email: string, otp: string) => {
    if (!otp) {
        throw BAD_REQUEST;
    }
    let storedOTP = await getOTP(email);
    
    if (!storedOTP || storedOTP != otp) {
        throw VERIFICATION_FAILED;
    }

    let user = await findUserByEmail(email);
    if(!user) {
        throw USER_NOT_FOUND;
    }

    await deleteOTP(otp);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '12h',
        });
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        token: token
    };
}

const login = async (email: string, password: string) => {
    if (!email || !password) {
        throw BAD_REQUEST;
    }
    let otp = await getOTP(email)
    if(!otp) {
        throw VERIFICATION_FAILED;
    }
    const user = await findUserByEmail(email);
    if(!user) {
        throw USER_NOT_FOUND;
    }
    if(await argon2.verify(user.password.toString(), password)) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '12h',
            });
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            token: token
        };         
    } 
    else {
        throw INVALID_CREDENTIALS;
    }
}

const userInfo = async (id: string) => {
    const user = await findUser({_id: id})
    if(!user) {
        throw USER_NOT_FOUND;
    }
    return user.toJSON()
}

export const usersList = async (currentUserId: string) => {
    const userList = await findAllUsers(currentUserId);
    return userList.map((user) => {
        return {
            id: user._id,
            name: user.name
        }
    });
}

export const update = async (id: string, userData: Partial<IUser>) =>{
    const updatedUser = await updateUser(id, userData);
    if(!updatedUser) {
        throw FAILED_USER_UPDATE;
    }
    return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
    }
}

export {registration, verifyOTP, login, userInfo, resendOTP}