export const environment = {
    production: false,
    apiUrl: {
        boxes: {
            infoAggregateFake: {
                pieno: 'https://api.myjson.com/bins/16f4c4', /* 2 FUNZIONARI, BOX-RICHIESTE, BOX-MEZZI  */
                vuoto: 'https://api.myjson.com/bins/e2ew0' /* 0 FUNZIONARI, NO BOX-RCHIESTE, NO BOX-MEZZI */
            },
            owm: {
                url: 'http://api.openweathermap.org/data/2.5/weather?',
                option: {
                    lang: 'it',
                    key: 'a23cc450dabf63fdb6729696aa29b3a6',
                    unit: 'metric'
                }

            }
        },
        maps: {
            markers: {
                fake1: 'https://api.myjson.com/bins/6vlu4',
                fake2: 'https://api.myjson.com/bins/1b6478'
            },
            agm: {
                key: 'AIzaSyDYIMWNyVt1X_30PybcDMTZkFkcSsUytDk'
            }
        },
        rigaElencoRichieste: {
            fake: 'https://api.myjson.com/bins/ajv6q',
            fake2: 'https://api.myjson.com/bins/1djrb6',
            backend: 'http://localhost:2661/api'
        },
        elencoFiltri: {
            fake: 'https://api.myjson.com/bins/yrkns',
            fake2: 'https://api.myjson.com/bins/qa8as' // Errore nel json
        }
    }
};
