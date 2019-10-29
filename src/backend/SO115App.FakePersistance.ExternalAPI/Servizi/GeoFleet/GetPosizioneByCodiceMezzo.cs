﻿//-----------------------------------------------------------------------
// <copyright file="GetPosizioneByCodiceMezzo.cs" company="CNVVF">
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
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.GeoFleet
{
    public class GetPosizioneByCodiceMezzo : IGetPosizioneByCodiceMezzo
    {
        private HttpClient _client;

        public GetPosizioneByCodiceMezzo(HttpClient client)
        {
            _client = client;
        }

        public MessaggioPosizione Get(string codiceMezzo)
        {
            var response = _client.GetAsync($"{Costanti.GeoFleetGetPosizioneByCodiceMezzo}{codiceMezzo}").ToString(); //L'API GeoFleet ancora non si aspetta una lista di codici mezzo
            return JsonConvert.DeserializeObject<MessaggioPosizione>(response);
        }
    }
}
