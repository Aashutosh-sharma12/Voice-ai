"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const industries_1 = __importDefault(require("./industries"));
const category_1 = __importDefault(require("./category"));
const user_1 = __importDefault(require("./user"));
const auth_1 = __importDefault(require("./auth"));
// import transection_router from "./transectionInfo";
const baserouter = (0, express_1.Router)();
baserouter.use('/industries', industries_1.default);
baserouter.use('/category', category_1.default);
baserouter.use('/user', user_1.default);
baserouter.use("/auth", auth_1.default);
exports.default = baserouter;
