﻿//-----------------------------------------------------------------------
// <copyright file="DbContext.cs" company="CNVVF">
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
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using SO115App.API.Models.Classi.Persistenza;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Persistence.MongoDB.Mappings;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("SO115App.CompositionRoot")]

namespace Persistence.MongoDB
{
    public class DbContext
    {
        private readonly IMongoDatabase database;

        public DbContext(string mongoUrl, string databaseName)
        {
            this.database = InitDbInstance(mongoUrl, databaseName);
            InitDbSettings();
            MapClasses();
        }

        private IMongoDatabase InitDbInstance(string mongoUrl, string databaseName)
        {
            var client = new MongoClient(mongoUrl);
            return client.GetDatabase(databaseName);
        }

        private void InitDbSettings()
        {
            var pack = new ConventionPack();
            pack.Add(new CamelCaseElementNameConvention());
            ConventionRegistry.Register("camel case", pack, t => true);
        }

        private void MapClasses()
        {
            EntityMap.Map();

            CodiceMap.Map();

            EventiMap.Map();

            ///Non più necessario grazie a MongoDB
            //BsonClassMap.RegisterClassMap<Evento>(cm =>
            //{
            //    cm.AutoMap();
            //    cm.MapProperty("TipoEvento").SetElementName("tipoEvento");
            //});

            //BsonClassMap.RegisterClassMap<Telefonata>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<AssegnazionePriorita>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<InizioPresaInCarico>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<ComposizionePartenze>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<AssegnataRichiesta>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<ArrivoSulPosto>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<RichiestaPresidiata>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<PartenzaRientrata>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<PartenzaInRientro>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<ChiusuraRichiesta>(cm =>
            //{
            //    cm.AutoMap();
            //});

            //BsonClassMap.RegisterClassMap<RiaperturaRichiesta>(cm =>
            //{
            //    cm.AutoMap();
            //});
        }

        public IMongoCollection<RichiestaAssistenza> RichiestaAssistenzaCollection
        {
            get
            {
                return database.GetCollection<RichiestaAssistenza>("richiesteAssistenza");
            }
        }
    }
}
