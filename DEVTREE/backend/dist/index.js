"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const colors_1 = __importDefault(require("colors"));
const db_1 = __importDefault(require("./config/db"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// DB connection
(0, db_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Rutas
app.use('/', routes_1.default);
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de DEVTREE!');
});
app.get('/health', (req, res) => {
    res.status(200).json({ message: ' HEALTH API is running smoothly!' });
}); // Start
app.listen(PORT, () => {
    console.log(colors_1.default.cyan.bold(`Servidor backend escuchando en el puerto ${PORT}`));
});
