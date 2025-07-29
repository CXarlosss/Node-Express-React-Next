"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.DATABASE_URL || '');
        console.log('MongoDB conectado:', conn.connection.name);
    }
    catch (error) {
        console.error('Error de conexión a MongoDB:', error);
        process.exit(1);
    }
};
exports.default = db;
23;
