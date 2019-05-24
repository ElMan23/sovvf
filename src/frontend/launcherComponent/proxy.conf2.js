const PROXY_CONFIG = [
    {
        context: [
            "/NotificationHub",
            "/api/auth/Login",
            "/api/Welcome",
            "/api/Navbar",
            "/api/Filtri",
            "/api/InserimentoIntervento",
            "/api/ComposizionePartenzaAvanzata",
            "/api/GetChiamataInCorso",
            "/api/ChiamataInCorso/Add",
            "/api/ChiamataInCorso/Delete",
            "/api/ChiamataInCorso"
        ],
        target: "http://so115.api2.test/",
        secure: false,
        "changeOrigin": true,
        ws: true
    }
];
module.exports = PROXY_CONFIG;
