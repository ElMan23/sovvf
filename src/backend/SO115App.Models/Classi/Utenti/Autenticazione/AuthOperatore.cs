//-----------------------------------------------------------------------
// <copyright file="AuthOperatore.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Servizi.Infrastruttura.Autenticazione;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace SO115App.API.Models.Classi.Utenti.Autenticazione
{
    public class AuthOperatore : IAuthOperatore
    {
        public async Task<Utente> Login(string username, string password)
        {
            Utente user = VerificaLogIn(username, password);

            return user;
        }

        //TODO DA MODIFICARE CON LA LOGICA DEL DB
        private Utente VerificaLogIn(string username, string password)
        {
            Utente user = new Utente(username);

            string filepath = "Fake/user.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<Utente> ListaUtenti = JsonConvert.DeserializeObject<List<Utente>>(json);

            user = ListaUtenti.Find(x => x.password.Equals(password) && x.username.Equals(username));

            if (user != null)
                return user;
            else
                return null;
        }
    }
}